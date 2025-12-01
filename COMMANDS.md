# Terminal Kit - Command Reference

A comprehensive reference for all commands available in Terminal Kit.

## Table of Contents

- [File Operations](#file-operations)
- [Navigation](#navigation)
- [Text Processing](#text-processing)
- [Network Tools](#network-tools)
- [Wireless Tools](#wireless-tools)
- [Security/Hacking Tools](#securityhacking-tools)
- [System Information](#system-information)
- [User Management](#user-management)
- [Package Management](#package-management)
- [Other Commands](#other-commands)
- [Operators and Pipes](#operators-and-pipes)

---

## File Operations

### ls - List Directory Contents

```bash
ls [OPTIONS] [FILE...]
```

**Options:**
- `-a, --all` - Show hidden files (starting with .)
- `-l` - Long listing format with permissions, owner, size, date

**Examples:**
```bash
ls                    # List current directory
ls -la               # List all files in long format
ls /etc              # List specific directory
ls -l *.txt          # List all .txt files
ls */*/*             # List files 3 levels deep
```

### cat - Concatenate and Display Files

```bash
cat [FILE...]
```

**Examples:**
```bash
cat file.txt                  # Display file contents
cat file1.txt file2.txt       # Display multiple files
cat /etc/passwd               # View system file
```

### head - Display Beginning of File

```bash
head [OPTIONS] [FILE...]
```

**Options:**
- `-n NUM` - Display first NUM lines (default: 10)

**Examples:**
```bash
head file.txt          # Show first 10 lines
head -n 5 file.txt     # Show first 5 lines
```

### tail - Display End of File

```bash
tail [OPTIONS] [FILE...]
```

**Options:**
- `-n NUM` - Display last NUM lines (default: 10)

**Examples:**
```bash
tail file.txt          # Show last 10 lines
tail -n 20 log.txt     # Show last 20 lines
```

### more / less - Paginated File Viewing

```bash
more [FILE]
less [FILE]
```

**Controls:**
- `SPACE` - Next page
- `q` - Quit

**Examples:**
```bash
more /var/log/syslog
less readme.txt
cat large_file.txt | more
```

### touch - Create Empty File

```bash
touch FILE...
```

**Examples:**
```bash
touch newfile.txt
touch file1.txt file2.txt
```

### mkdir - Create Directory

```bash
mkdir DIRECTORY
```

**Examples:**
```bash
mkdir projects
mkdir /tmp/mydir
```

### rm - Remove Files/Directories

```bash
rm [OPTIONS] FILE...
```

**Options:**
- `-r, -R` - Recursive (for directories)
- `-f` - Force

**Examples:**
```bash
rm file.txt
rm -r directory/
rm -rf /tmp/test
```

### cp - Copy Files

```bash
cp SOURCE DEST
```

**Examples:**
```bash
cp file.txt backup.txt
cp /etc/passwd ~/passwd_backup
```

### mv - Move/Rename Files

```bash
mv SOURCE DEST
```

**Examples:**
```bash
mv oldname.txt newname.txt
mv file.txt /tmp/
```

### chmod - Change File Permissions

```bash
chmod MODE FILE
```

**Examples:**
```bash
chmod 755 script.sh
chmod +x executable
```

### chown - Change File Owner

```bash
chown OWNER[:GROUP] FILE
```

**Examples:**
```bash
chown root file.txt
chown user:group file.txt
```

### tar - Archive Files

```bash
tar [OPTIONS] [FILE...]
```

**Options:**
- `-c` - Create archive
- `-x` - Extract archive
- `-v` - Verbose
- `-f` - Specify file
- `-z` - Gzip compression

**Examples:**
```bash
tar -cvf archive.tar files/
tar -xvf archive.tar
tar -czvf archive.tar.gz files/
```

### gzip - Compress Files

```bash
gzip [OPTIONS] [FILE]
```

**Options:**
- `-d` - Decompress

**Examples:**
```bash
gzip file.txt
gzip -d file.txt.gz
```

---

## Navigation

### cd - Change Directory

```bash
cd [DIRECTORY]
```

**Examples:**
```bash
cd                    # Go to home directory
cd ~                  # Go to home directory
cd ..                 # Go to parent directory
cd -                  # Go to previous directory
cd /var/log           # Go to absolute path
cd projects           # Go to relative path
```

### pwd - Print Working Directory

```bash
pwd
```

**Example:**
```bash
pwd                   # Output: /home/user
```

### find - Search for Files

```bash
find [PATH] [EXPRESSION]
```

**Options:**
- `-name PATTERN` - Search by filename
- `-type TYPE` - Search by type (f=file, d=directory)

**Examples:**
```bash
find . -name "*.txt"           # Find all .txt files
find /etc -name "passwd"       # Find passwd in /etc
find /home -type d             # Find all directories
```

---

## Text Processing

### grep - Search Text Patterns

```bash
grep [OPTIONS] PATTERN [FILE...]
```

**Options:**
- `-i` - Case insensitive
- `-v` - Invert match (show non-matching lines)

**Examples:**
```bash
grep "error" log.txt            # Search for "error"
grep -i "ERROR" log.txt         # Case insensitive search
grep -v "debug" log.txt         # Lines NOT containing "debug"
cat file.txt | grep "pattern"   # Search piped input
```

### echo - Display Text

```bash
echo [STRING...]
```

**Examples:**
```bash
echo "Hello World"
echo $USER                      # Print variable
echo -e "Line1\nLine2"          # With newlines
```

### strings - Extract Printable Strings

```bash
strings [FILE]
```

**Examples:**
```bash
strings binary_file
strings /usr/bin/ls
```

### base64 - Encode/Decode Base64

```bash
base64 [OPTIONS] [FILE]
```

**Options:**
- `-d, --decode` - Decode base64

**Examples:**
```bash
echo "hello" | base64           # Encode
echo "aGVsbG8K" | base64 -d     # Decode
base64 file.txt                 # Encode file
```

---

## Network Tools

### ping - Test Network Connectivity

```bash
ping [OPTIONS] DESTINATION
```

**Options:**
- `-c COUNT` - Stop after COUNT packets

**Examples:**
```bash
ping google.com
ping -c 4 192.168.1.1
ping github.com
```

*Press Ctrl+C to interrupt*

### traceroute - Trace Packet Route

```bash
traceroute HOST
```

**Examples:**
```bash
traceroute google.com
traceroute 8.8.8.8
```

### nmap - Network Scanner

```bash
nmap [OPTIONS] TARGET
```

**Options:**
- `-sV` - Service version detection
- `-p PORT` - Scan specific ports
- `-A` - Aggressive scan (OS + version + scripts)

**Examples:**
```bash
nmap 192.168.1.1
nmap -sV google.com
nmap -p 22,80,443 target.com
nmap -A 10.0.0.1
```

### ssh - Secure Shell

```bash
ssh [user@]hostname
```

**Examples:**
```bash
ssh server.com
ssh root@192.168.1.1
ssh admin@gibson.ellingson.com
```

*Note: SSH works with special easter egg hosts (see EASTER-EGGS.md)*

### scp - Secure Copy

```bash
scp SOURCE DESTINATION
```

**Examples:**
```bash
scp file.txt user@host:/path/
scp user@host:/file.txt ./
```

### curl - Transfer Data

```bash
curl [OPTIONS] URL
```

**Options:**
- `-o FILE` - Write output to file
- `-X METHOD` - HTTP method

**Examples:**
```bash
curl http://example.com
curl -o page.html http://example.com
```

### wget - Download Files

```bash
wget [OPTIONS] URL
```

**Options:**
- `-O FILE` - Output filename

**Examples:**
```bash
wget http://example.com/file.zip
wget -O myfile.zip http://example.com/file.zip
```

### nc (netcat) - Network Utility

```bash
nc [OPTIONS] HOST PORT
```

**Options:**
- `-l` - Listen mode
- `-v` - Verbose

**Examples:**
```bash
nc -v host.com 80
nc -l 4444
```

### telnet - Telnet Client

```bash
telnet HOST [PORT]
```

**Examples:**
```bash
telnet server.com
telnet server.com 23
```

### ifconfig - Network Interface Configuration

```bash
ifconfig
```

Displays network interface information including IP addresses.

### netstat - Network Statistics

```bash
netstat
```

Displays network connections and listening ports.

### route - Routing Table

```bash
route
```

Displays IP routing table.

### whois - Domain Lookup

```bash
whois DOMAIN
```

**Examples:**
```bash
whois google.com
whois github.com
```

### nslookup - DNS Lookup

```bash
nslookup HOST
```

**Examples:**
```bash
nslookup google.com
nslookup github.com
```

### dig - DNS Lookup Utility

```bash
dig [HOST]
```

**Examples:**
```bash
dig google.com
dig @8.8.8.8 example.com
```

### host - DNS Lookup

```bash
host NAME
```

**Examples:**
```bash
host google.com
```

### arp - ARP Table

```bash
arp [OPTIONS]
```

**Options:**
- `-a` - Display all entries

**Examples:**
```bash
arp -a
```

### iptables - Firewall Rules

```bash
iptables [OPTIONS]
```

Displays simulated firewall rules.

---

## Wireless Tools

### iwconfig - Wireless Configuration

```bash
iwconfig [INTERFACE]
```

**Examples:**
```bash
iwconfig
iwconfig wlan0
```

### airodump-ng - Wireless Packet Capture

```bash
airodump-ng [OPTIONS] INTERFACE
```

**Options:**
- `-w FILE` - Write to file
- `--bssid BSSID` - Filter by BSSID
- `-c CHANNEL` - Set channel

**Examples:**
```bash
airodump-ng wlan0
airodump-ng -w capture --bssid AA:BB:CC:DD:EE:FF -c 6 wlan0
```

*This creates capture files needed for aircrack-ng*

### aircrack-ng - WiFi Password Cracker

```bash
aircrack-ng [OPTIONS] <capture_file>
```

**Options:**
- `-w WORDLIST` - Wordlist file
- `-b BSSID` - Target BSSID
- `-e ESSID` - Target network name

**Examples:**
```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap
```

*See EASTER-EGGS.md for complete WiFi cracking tutorial*

---

## Security/Hacking Tools

### john - John the Ripper Password Cracker

```bash
john [OPTIONS] [PASSWORD-FILES]
```

**Options:**
- `--wordlist=FILE` - Use wordlist
- `--show` - Show cracked passwords

**Examples:**
```bash
john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt
john --show hashes.txt
```

*See EASTER-EGGS.md for password cracking challenges*

### hashcat - Advanced Password Recovery

```bash
hashcat [OPTIONS] HASH [DICTIONARY]
```

**Options:**
- `-m TYPE` - Hash type (0=MD5, 100=SHA1)
- `-a MODE` - Attack mode

**Examples:**
```bash
hashcat -m 0 hash.txt wordlist.txt
```

### md5sum - MD5 Checksum

```bash
md5sum [FILE]
```

**Examples:**
```bash
md5sum file.txt
echo "text" | md5sum
```

### sha256sum - SHA256 Checksum

```bash
sha256sum [FILE]
```

**Examples:**
```bash
sha256sum file.txt
```

### openssl - Cryptographic Toolkit

```bash
openssl COMMAND [OPTIONS]
```

**Commands:**
- `enc` - Encoding/encryption
- `dgst` - Message digests
- `genrsa` - Generate RSA keys
- `rsa` - RSA key management

**Examples:**
```bash
openssl enc -base64 -in file.txt
openssl dgst -sha256 file.txt
```

### tcpdump - Packet Capture

```bash
tcpdump [OPTIONS]
```

Simulates packet capture output.

---

## System Information

### whoami - Current Username

```bash
whoami
```

### hostname - System Hostname

```bash
hostname
```

### uname - System Information

```bash
uname [OPTIONS]
```

**Options:**
- `-a` - All information

**Examples:**
```bash
uname
uname -a
```

### date - Current Date/Time

```bash
date
```

### w - Who is Logged In

```bash
w
```

Shows logged in users and their activity.

### who - Logged In Users

```bash
who
```

### ps - Process Status

```bash
ps [OPTIONS]
```

**Options:**
- `aux` - All processes

**Examples:**
```bash
ps
ps aux
```

### top - Process Monitor

```bash
top
```

Interactive process viewer. Press `q` to quit.

### history - Command History

```bash
history
```

Shows previously executed commands.

### finger - User Information

```bash
finger [USERNAME]
```

**Examples:**
```bash
finger
finger root
```

---

## User Management

### su - Switch User

```bash
su [USERNAME]
```

**Examples:**
```bash
su              # Switch to root
su admin        # Switch to admin user
```

### sudo - Execute as Root

```bash
sudo COMMAND
```

**Examples:**
```bash
sudo cat /etc/shadow
sudo su         # Become root
```

### useradd - Add User

```bash
useradd [OPTIONS] USERNAME
```

**Options:**
- `-m` - Create home directory

**Examples:**
```bash
sudo useradd -m newuser
```

### exit - Exit Shell/Session

```bash
exit
```

Exits current shell or SSH session.

---

## Package Management

### apt - Package Manager

```bash
apt [COMMAND] [PACKAGE]
```

**Commands:**
- `update` - Update package lists
- `upgrade` - Upgrade packages
- `install PKG` - Install package
- `remove PKG` - Remove package

**Examples:**
```bash
sudo apt update
sudo apt install nmap
```

### dpkg - Debian Package Manager

```bash
dpkg [OPTIONS]
```

**Options:**
- `-l` - List packages
- `-i FILE` - Install package
- `-r PKG` - Remove package

**Examples:**
```bash
dpkg -l
```

---

## Other Commands

### clear - Clear Screen

```bash
clear
```

### which - Locate Command

```bash
which COMMAND
```

**Examples:**
```bash
which ls
which nmap
```

### env - Environment Variables

```bash
env
```

### export - Set Environment Variable

```bash
export NAME=VALUE
```

**Examples:**
```bash
export PATH=/usr/bin:$PATH
export MY_VAR="value"
```

### bash - Start New Shell

```bash
bash
```

### help - Display Help

```bash
help
```

Shows available commands and tips.

---

## Operators and Pipes

### Pipe ( | )

Chain commands together:

```bash
cat file.txt | grep "error" | more
ps aux | grep nginx
ls -la | head -20
```

### Output Redirection ( > )

Write output to file (overwrites):

```bash
ls > files.txt
echo "hello" > greeting.txt
```

### Append Redirection ( >> )

Append output to file:

```bash
echo "new line" >> file.txt
date >> log.txt
```

### AND Operator ( && )

Run next command only if previous succeeds:

```bash
cd /tmp && ls
mkdir test && cd test
```

### OR Operator ( || )

Run next command only if previous fails:

```bash
cat file.txt || echo "File not found"
```

### Semicolon ( ; )

Run commands sequentially regardless of success:

```bash
echo "start"; sleep 2; echo "done"
```

---

## Glob Patterns

### Wildcards

- `*` - Match any characters
- `?` - Match single character

**Examples:**
```bash
ls *.txt           # All .txt files
ls file?.txt       # file1.txt, fileA.txt, etc.
ls */*/*           # Files 3 directories deep
cat /etc/*.conf    # All .conf files in /etc
```

---

## Tips

1. **Tab Completion**: Press TAB to auto-complete commands and paths
2. **Command History**: Use UP/DOWN arrows to navigate history
3. **Ctrl+C**: Interrupt running commands (like ping)
4. **Case Sensitivity**: Commands and paths are case-sensitive
5. **Hidden Files**: Files starting with `.` are hidden (use `ls -a`)

---

## See Also

- [README.md](README.md) - Main documentation
- [EASTER-EGGS.md](EASTER-EGGS.md) - Hidden features and hacking challenges
