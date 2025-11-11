import { createWindow } from './main.js';
import { processCommand, listDirectory, resolvePath, environment } from './terminal_commands.js';
import { getDirectory, getFile, loadUserHistory, getCurrentHistory, setCurrentHistory, addToHistory, resetToInitialUser } from './terminal_filesystem.js'; // Added import

function waitKey(terminalWindow) {
    return new Promise(resolve => {
        // Set flag to prevent global Ctrl+C handler from interfering
        window.isWaitingForKey = true;

        const keydownHandler = (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // Prevent other handlers from firing
            terminalWindow.removeEventListener('keydown', keydownHandler);
            window.isWaitingForKey = false;

            // Return special signal for Ctrl+C
            if (e.ctrlKey && e.key === 'c') {
                resolve('CTRL_C');
            } else {
                resolve(e.key);
            }
        };
        terminalWindow.addEventListener('keydown', keydownHandler);
    });
}

function createNewTerminalWindow() {
    // Helper function to format path display
    function getDisplayPath(path) {
        if (path === environment.HOME) return '~';
        if (path.startsWith(environment.HOME + '/')) return '~' + path.substring(environment.HOME.length);
        return path;
    }

    // Check if terminal already exists - if so, just focus it
    const existingWindow = document.getElementById('window-new-terminal');
    if (existingWindow) {
        // Terminal already open, just focus/restore it
        createWindow('new-terminal', '', '', {});
        return;
    }

    // Reset to initial user state (fresh terminal)
    resetToInitialUser();

    const terminalHTML = `

        <div class="terminal-body" id="terminalBody">

            <div class="terminal-inner-content">

                <div class="terminal-output">Welcome to Brainphreak Linux Terminal v1.0</div>

                <div class="terminal-output">Type 'help' for available commands</div>

                <div class="terminal-output"></div>

            </div>

        </div>

    `;



    const terminalWindow = createWindow('new-terminal', `${environment.USER}@${environment.HOSTNAME}:${getDisplayPath(environment.CWD)}`, terminalHTML, {

        width: 600,

        height: 400,

        customClass: 'terminal-container'

    });



            const terminalBody = terminalWindow.querySelector('.terminal-body');



            terminalBody.tabIndex = -1; // Make it focusable



            const terminalInnerContent = terminalBody.querySelector('.terminal-inner-content');



            let currentInput = null;



                    let historyIndex = -1;

                    // Load command history for current user
                    const initialHistory = loadUserHistory(environment.USER);
                    setCurrentHistory(initialHistory);
                    const commandHistory = getCurrentHistory();



            let lastTabCompletionOutput = null; // New variable to track last tab completion output



        



            // Use global state to avoid closure issues



            window.isCommandRunning = false;



            window.isCommandInterrupted = false;



        



            function getDisplayPath(path) {



        



                if (path === environment.HOME) return '~';



        



                if (path.startsWith(environment.HOME + '/')) return '~' + path.substring(environment.HOME.length);



        



                return path;



        



            }



        



            function updatePromptAndTitle() {



        



                const promptElements = terminalInnerContent.querySelectorAll('.terminal-prompt');



        



                promptElements.forEach(prompt => {



        



                    prompt.textContent = `${environment.USER}@${environment.HOSTNAME}:${getDisplayPath(environment.CWD)}$ `;



        



                });



        



                terminalWindow.querySelector('.window-title-bar span').textContent = `${environment.USER}@${environment.HOSTNAME}:${getDisplayPath(environment.CWD)}`;



        



            }



        



            function addInputLine() {



                const inputLine = document.createElement('div');



                inputLine.className = 'terminal-input-line';



        



                const prompt = document.createElement('span');



                prompt.className = 'terminal-prompt';



                prompt.textContent = `${environment.USER}@${environment.HOSTNAME}:${getDisplayPath(environment.CWD)}$ `;



        



                const input = document.createElement('input');



                input.className = 'terminal-input';



                input.type = 'text';



        



                inputLine.appendChild(prompt);



                inputLine.appendChild(input);



                terminalInnerContent.appendChild(inputLine);



        



                currentInput = input;



        



                input.focus();



        



                // Scroll to bottom after DOM updates
                requestAnimationFrame(() => {
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                });



            }



        



                        terminalWindow.addEventListener('keydown', async (e) => {







                            if (e.ctrlKey && e.key === 'c') {

                                // Don't handle if waitKey is active (it will handle it)
                                if (window.isWaitingForKey) {
                                    return;
                                }







                                if (window.isCommandRunning) {







                                    window.isCommandInterrupted = true;







                                    const output = document.createElement('div');







                                    output.className = 'terminal-output';







                                    output.textContent = '^C';







                                    terminalInnerContent.appendChild(output);







                                    terminalBody.scrollTop = terminalBody.scrollHeight;







                                } else {



        



                                    // If no command is running, just show ^C and a new line



        



                                    currentInput.value += '^C';



        



                                    currentInput.setAttribute('readonly', true);



        



                                    addInputLine();



        



                                }



        



                                return;



        



                            }



        



                    



        



                            if (e.key === 'ArrowUp') {



        



                                e.preventDefault();



        



                                if (commandHistory.length > 0) {



        



                                    if (historyIndex < commandHistory.length - 1) {



        



                                        historyIndex++;



        



                                        currentInput.value = commandHistory[historyIndex];



        



                                        currentInput.focus();



        



                                        setTimeout(() => currentInput.setSelectionRange(currentInput.value.length, currentInput.value.length), 0);



        



                                    }



        



                                }



        



                            } else if (e.key === 'ArrowDown') {



        



                                e.preventDefault();



        



                                if (historyIndex > 0) {



        



                                    historyIndex--;



        



                                    currentInput.value = commandHistory[historyIndex];



        



                                    currentInput.focus();



        



                                    setTimeout(() => currentInput.setSelectionRange(currentInput.value.length, currentInput.value.length), 0);



        



                                } else if (historyIndex === 0) {



        



                                    historyIndex = -1;



        



                                    currentInput.value = '';



        



                                }



        



                                    } else if (e.key === 'Tab') {
            e.preventDefault();
            const input = currentInput.value;
            const parts = input.split(' ');
            let lastPart = parts[parts.length - 1];

            // Handle flag=value syntax (e.g., --wordlist=/usr/share)
            let prefixBeforeEquals = '';
            if (lastPart.includes('=')) {
                const equalIndex = lastPart.lastIndexOf('=');
                prefixBeforeEquals = lastPart.substring(0, equalIndex + 1);
                lastPart = lastPart.substring(equalIndex + 1);
            }

            if (lastPart.length === 0) {
                return;
            }

            // Command completion logic
            if (parts.length === 1 && prefixBeforeEquals === '') {
                const PATH = environment.PATH.split(':');
                const allCommands = new Set();
                for (const p of PATH) {
                    const dir = getDirectory(p);
                    if (dir && dir.contents) {
                        Object.keys(dir.contents).forEach(name => {
                            const item = dir.contents[name];
                            if (item.type === 'file' && item.content === 'ELF executable') {
                                allCommands.add(name);
                            }
                        });
                    }
                }
                const commandMatches = Array.from(allCommands).filter(cmd => cmd.startsWith(lastPart));
                if (commandMatches.length === 1) {
                    currentInput.value = commandMatches[0];
                    return;
                } else if (commandMatches.length > 1) {
                    // Clear previous tab completion output if it exists
                    if (lastTabCompletionOutput && lastTabCompletionOutput.parentNode) {
                        lastTabCompletionOutput.parentNode.removeChild(lastTabCompletionOutput);
                        lastTabCompletionOutput = null;
                    }
                    const output = document.createElement('div');
                    output.className = 'terminal-output';
                    output.textContent = commandMatches.join('  ');
                    terminalInnerContent.appendChild(output);
                    terminalBody.scrollTop = terminalBody.scrollHeight;
                    lastTabCompletionOutput = output; // Store reference to this output
                    return;
                }
            }

            // Path completion logic (original logic, slightly modified to use lastPart as prefix)
            const path = resolvePath(lastPart, environment.CWD);
            const lastSlashIndex = path.lastIndexOf('/');
            const dirPath = lastSlashIndex === 0 ? '/' : path.substring(0, lastSlashIndex) || environment.CWD;
            const prefix = path.substring(lastSlashIndex + 1);

            // Show hidden files if user typed a dot
            const showHidden = lastPart.startsWith('.') || prefix.startsWith('.');
            const dirContents = listDirectory(dirPath, showHidden);

            if (typeof dirContents === 'string') {
                // Error listing directory
                return;
            }

            const matches = dirContents.filter(item => {
                // If showing hidden files, match everything
                if (showHidden) {
                    return item.name.startsWith(prefix);
                }
                // Otherwise, exclude hidden files
                return !item.name.startsWith('.') && item.name.startsWith(prefix);
            });

            if (matches.length === 1) {
                const match = matches[0];
                const completion = match.name.substring(prefix.length);

                // If we had a prefix before '=' (like --wordlist=), we need to replace the entire last part
                if (prefixBeforeEquals) {
                    const beforeLastPart = parts.slice(0, -1).join(' ');
                    const completedPath = prefixBeforeEquals + lastPart + completion;
                    currentInput.value = beforeLastPart ? beforeLastPart + ' ' + completedPath : completedPath;
                } else {
                    currentInput.value += completion;
                }

                if (match.type === 'directory') {
                    currentInput.value += '/';
                }
            } else if (matches.length > 1) {
                // Clear previous tab completion output if it exists
                if (lastTabCompletionOutput && lastTabCompletionOutput.parentNode) {
                    lastTabCompletionOutput.parentNode.removeChild(lastTabCompletionOutput);
                    lastTabCompletionOutput = null;
                }

                const output = document.createElement('div');
                output.className = 'terminal-output';
                output.textContent = matches.map(m => m.name).join('  ');
                terminalInnerContent.appendChild(output);
                terminalBody.scrollTop = terminalBody.scrollHeight;
                lastTabCompletionOutput = output; // Store reference to this output
            }
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    // Clear previous tab completion output if it exists
                    if (lastTabCompletionOutput && lastTabCompletionOutput.parentNode) {
                        lastTabCompletionOutput.parentNode.removeChild(lastTabCompletionOutput);
                        lastTabCompletionOutput = null;
                    }

                    const cmd = currentInput.value;
                    currentInput.setAttribute('readonly', true);
        
                    window.isCommandRunning = true;
                    window.isCommandInterrupted = false;
        
                    const { currentDirectory, previousDirectory } = await processCommand(cmd, {
                        terminalInnerContent,
                        terminalBody,
                        currentInput,
                        commandHistory,
                        username: environment.USER,
                        getDisplayPath,
                        setNewCurrentDirectory: (newDir, oldDir) => {
                            environment.CWD = newDir;
                            environment.OLDPWD = oldDir;
                        },
                        waitKey: () => waitKey(terminalWindow)
                    });
        
                    environment.CWD = currentDirectory;
                    environment.OLDPWD = previousDirectory;
        
                    window.isCommandRunning = false;
        
                    addInputLine();
                    historyIndex = -1;
                }



        



                        });



    function handleTabCompletion(input) {

        const inputValue = input.value;

        const parts = inputValue.split(' ');

        let partial = parts[parts.length - 1]; // The last part is what we're trying to complete

        let baseDirForCompletion = environment.CWD; // The directory to search within

        let namePartial = partial; // The actual name part to match against

        let matches = [];

        let isAbsolutePath = false; // Flag to remember if the partial path started with '/'



        // Helper to display matches

        const displayMatches = (matchList) => {

            // Remove previous tab completion output if it exists

            if (lastTabCompletionOutput && lastTabCompletionOutput.parentNode) {

                lastTabCompletionOutput.parentNode.removeChild(lastTabCompletionOutput);

                lastTabCompletionOutput = null;

            }



            if (matchList.length === 1) {

                let completedValue = matchList[0];

                // If it's a directory, add a slash

                const resolvedPath = resolvePath(completedValue, baseDirForCompletion);

                const entry = getDirectory(resolvedPath) || getFile(resolvedPath);

                if (entry && entry.type === 'directory') {

                    completedValue += '/';

                }

                

                // Reconstruct the input value, preserving the leading slash if it was an absolute path

                let prefix = inputValue.substring(0, inputValue.lastIndexOf(namePartial)); // Use namePartial here

                if (isAbsolutePath && !prefix.endsWith('/')) { // Ensure we don't double-slash if prefix already ends with one

                    prefix += '/';

                }

                input.value = prefix + completedValue;



            } else if (matchList.length > 1) {

                const output = document.createElement('div');

                output.className = 'terminal-output';

                output.textContent = matchList.join('  ');

                // Append the output after the current input line

                terminalInnerContent.appendChild(output);

                // Scroll the newly added output element into view

                output.scrollIntoView({ behavior: 'smooth', block: 'end' });

                lastTabCompletionOutput = output; // Store reference to this output

            }

        };



        // Case 1: Completing a command (first word, or after 'cd', 'ls', etc.)

        if (parts.length === 1 || (parts.length > 1 && ['cd', 'ls', 'cat', 'more', 'less', 'touch', 'grep', 'find'].includes(parts[0]))) {

            // If it's the first word, try to complete commands

            if (parts.length === 1) {

                const PATH = environment.PATH.split(':');

                const allCommands = new Set();

                for (const p of PATH) {

                    const dir = getDirectory(p);

                    if (dir && dir.contents) {

                        Object.keys(dir.contents).forEach(name => {

                            const item = dir.contents[name];

                            if (item.type === 'file' && item.content === 'ELF executable') {

                                allCommands.add(name);

                            }

                        });

                    }

                }

                matches = Array.from(allCommands).filter(cmd => cmd.startsWith(partial));

                if (matches.length > 0) {

                    displayMatches(matches);

                    return;

                }

            }



            // If command completion didn't yield results, or if it's a path argument

            // Determine the base directory for path completion

            if (partial.startsWith('/')) {

                isAbsolutePath = true;

                const lastSlashIndex = partial.lastIndexOf('/');

                if (lastSlashIndex === 0) { // e.g., "/e"

                    baseDirForCompletion = '/';

                    namePartial = partial.substring(1);

                } else if (lastSlashIndex > 0) { // e.g., "/etc/h"

                    baseDirForCompletion = partial.substring(0, lastSlashIndex);

                    namePartial = partial.substring(lastSlashIndex + 1);

                } else { // e.g., "/etc" (no trailing slash, but partial is absolute)

                    baseDirForCompletion = '/';

                    namePartial = partial.substring(1);

                }

            } else if (partial.startsWith('~')) {

                baseDirForCompletion = environment.HOME;

                namePartial = partial.substring(1);

                const lastSlashIndex = namePartial.lastIndexOf('/');

                if (lastSlashIndex !== -1) {

                    baseDirForCompletion = resolvePath(namePartial.substring(0, lastSlashIndex), environment.HOME);

                    namePartial = namePartial.substring(lastSlashIndex + 1);

                }

            } else if (partial.includes('/')) {

                const lastSlashIndex = partial.lastIndexOf('/');

                baseDirForCompletion = resolvePath(partial.substring(0, lastSlashIndex), environment.CWD);

                namePartial = partial.substring(lastSlashIndex + 1);

            } else {

                baseDirForCompletion = environment.CWD;

                namePartial = partial;

            }



            const dirToSearch = getDirectory(baseDirForCompletion);

            if (dirToSearch && dirToSearch.contents) {

                // Filter files - include hidden files if namePartial starts with '.'
                // or if namePartial is empty and we want to show all visible files
                matches = Object.keys(dirToSearch.contents).filter(name => {
                    // If user typed '.', show all files including hidden
                    if (namePartial.startsWith('.')) {
                        return name.startsWith(namePartial);
                    }
                    // Otherwise, only show non-hidden files
                    return !name.startsWith('.') && name.startsWith(namePartial);
                });

                displayMatches(matches);

            }

        }

    }



    terminalBody.addEventListener('click', function(e) {

        if (currentInput) {

            currentInput.focus();

            currentInput.setSelectionRange(currentInput.value.length, currentInput.value.length);

        }

    });



    addInputLine();

}

export { createNewTerminalWindow };