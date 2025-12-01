# Terminal Kit - Easter Eggs & Hacking Guide

This document reveals all the hidden features, easter eggs, and hacking challenges in Terminal Kit. Perfect for learning security concepts in a safe, simulated environment.

## Table of Contents

- [WiFi Cracking Challenge](#wifi-cracking-challenge)
- [Password Cracking with John the Ripper](#password-cracking-with-john-the-ripper)
- [SSH Easter Egg Hosts](#ssh-easter-egg-hosts)
- [Hidden Files & Secrets](#hidden-files--secrets)
- [Base64 Encoded Secrets](#base64-encoded-secrets)
- [Fun Commands](#fun-commands)
- [Movie References](#movie-references)

---

## WiFi Cracking Challenge

Learn the basics of WiFi security assessment using aircrack-ng suite.

### Step 1: Check Your Wireless Interface

```bash
iwconfig
```

Output shows `wlan0` interface in monitor mode.

### Step 2: Scan for Networks

```bash
airodump-ng wlan0
```

This will show available networks. Look for networks with "WPA" encryption.

Example output:
```
 BSSID              PWR  Beacons    #Data  CH  ENC   ESSID
 AA:BB:CC:DD:EE:FF  -42      100      156   6  WPA2  CoffeeShop_WiFi
 11:22:33:44:55:66  -67       85       42  11  WPA2  Home_Network
```

### Step 3: Capture the Handshake

Target a specific network and capture packets:

```bash
airodump-ng -w capture --bssid AA:BB:CC:DD:EE:FF -c 6 wlan0
```

Options:
- `-w capture` - Save to files named "capture-01.cap"
- `--bssid AA:BB:CC:DD:EE:FF` - Target specific access point
- `-c 6` - Channel number

Wait for "WPA handshake" to appear (simulated automatically).

### Step 4: Crack the Password

Use aircrack-ng with a wordlist:

```bash
aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap
```

The simulated networks have passwords from the wordlist, so cracking will succeed!

### Available Wordlists

```bash
ls /usr/share/wordlists/
```

- `rockyou.txt` - Famous leaked password list
- `common.txt` - Common passwords
- `wifi_passwords.txt` - Common WiFi passwords

### Complete WiFi Cracking Example

```bash
# 1. Check interface
iwconfig

# 2. Scan networks
airodump-ng wlan0

# 3. Capture handshake (pick a network from the scan)
airodump-ng -w hack --bssid AA:BB:CC:DD:EE:FF -c 6 wlan0

# 4. Crack the password
aircrack-ng -w /usr/share/wordlists/rockyou.txt hack-01.cap
```

---

## Password Cracking with John the Ripper

### Finding Password Hashes

First, find files containing password hashes:

```bash
find / -name "*hash*" 2>/dev/null
find / -name "*shadow*" 2>/dev/null
find / -name "*passwd*" 2>/dev/null
```

Check the `/etc` directory:

```bash
cat /etc/shadow
cat /etc/passwd
```

### Pre-loaded Hash Files

There are hash files waiting to be cracked:

```bash
ls /home/*/
cat /home/user/hashes.txt
```

### Cracking with John

```bash
# Basic crack with wordlist
john --wordlist=/usr/share/wordlists/rockyou.txt /etc/shadow

# Show cracked passwords
john --show /etc/shadow
```

### Example Session

```bash
# Find hash files
find /home -name "*.txt" 2>/dev/null

# View the hashes
cat /home/user/hashes.txt

# Crack them
john --wordlist=/usr/share/wordlists/rockyou.txt /home/user/hashes.txt

# View results
john --show /home/user/hashes.txt
```

### Hash Formats

The system uses MD5 hashes. Example:
```
admin:5f4dcc3b5aa765d61d8327deb882cf99
```

Common passwords to try: `password`, `123456`, `admin`, `letmein`, `qwerty`

---

## SSH Easter Egg Hosts

SSH into special movie-themed hosts to discover hidden files and easter eggs!

### Hackers (1995) - The Gibson

```bash
ssh root@gibson.ellingson.com
# or
ssh zerocool@gibson.ellingson.com
ssh acidburn@gibson.ellingson.com
```

Once connected:
```bash
ls -la                    # See hidden files
cat .garbage              # The famous garbage file
cat HACK_THE_PLANET.txt   # Hacker roster
cat .hackers_manifesto    # The Conscience of a Hacker
cat .bash_history         # See what commands were run
```

### The Matrix (1999)

```bash
ssh neo@matrix.metacortex.com
# or
ssh morpheus@matrix.zion.net
ssh trinity@matrix.zion.net
```

Once connected:
```bash
ls -la
cat .the_one             # Neo's destiny
cat follow_the_rabbit.txt
cat /etc/matrix.conf     # Matrix configuration
cat /etc/connected_users # People still in the Matrix
```

### WarGames (1983) - WOPR

```bash
ssh falken@wopr.norad.gov
# or
ssh joshua@wargames.norad.gov
```

Once connected:
```bash
ls -la
cat WOPR_README.txt       # JOSHUA's message
cat .wopr_commands        # Game commands
cat .wopr_backdoor        # The famous backdoor password
cat /etc/wopr.conf        # System configuration
```

### Mr. Robot (2015)

```bash
ssh elliot@fsociety.org
# or
ssh mrrobot@allsafe.com
ssh root@evilcorp.com
```

Once connected:
```bash
ls -la
cat fsociety_readme.txt   # fsociety manifesto
cat .da_encryption_key    # Encryption keys
cat /etc/ecorp_data       # E Corp secrets
```

### How SSH Easter Eggs Work

1. Any hostname containing keywords triggers special content:
   - `gibson`, `hacker` - Hackers (1995) theme
   - `matrix` - The Matrix theme
   - `wopr`, `wargames` - WarGames theme
   - `fsociety`, `ecorp`, `allsafe`, `evilcorp` - Mr. Robot theme

2. Use `nmap` first to find open ports:
```bash
nmap gibson.ellingson.com
```

3. Connect via SSH and explore!

---

## Hidden Files & Secrets

### System Secrets

```bash
# View all hidden files in home directory
ls -la ~

# Check bash history
cat ~/.bash_history

# View system configuration
cat /etc/passwd
cat /etc/shadow

# Root's secrets
sudo cat /root/.secret
```

### Finding Hidden Content

```bash
# Find all hidden files
find / -name ".*" -type f 2>/dev/null

# Find files with interesting names
find / -name "*secret*" 2>/dev/null
find / -name "*password*" 2>/dev/null
find / -name "*hack*" 2>/dev/null
find / -name "*flag*" 2>/dev/null
```

### The Garbage File

In Hackers (1995), the "garbage file" was crucial. Find it:

```bash
ssh root@gibson.ellingson.com
cat .garbage
```

---

## Base64 Encoded Secrets

Some hidden files contain base64 encoded messages that must be decoded to reveal their secrets!

### Finding Encoded Files

Look for files with names suggesting encoded content:

```bash
find / -name "*encoded*" 2>/dev/null
find / -name "*secret*" 2>/dev/null
```

### The Matrix - Encoded Message

SSH into a Matrix host and find the encoded file:

```bash
ssh neo@matrix.metacortex.com
ls -la
cat .encoded_message
```

Output:
```
VGhlcmUgaXMgbm8gc3Bvb24u
```

Decode it:
```bash
echo "VGhlcmUgaXMgbm8gc3Bvb24u" | base64 -d
```

Result: `There is no spoon.`

### WarGames - WOPR Secret

SSH into the WOPR and find the secret:

```bash
ssh joshua@wopr.norad.gov
ls -la
cat .wopr_secret
```

Output:
```
VGhlIG9ubHkgd2lubmluZyBtb3ZlIGlzIG5vdCB0byBwbGF5Lg==
```

Decode it:
```bash
echo "VGhlIG9ubHkgd2lubmluZyBtb3ZlIGlzIG5vdCB0byBwbGF5Lg==" | base64 -d
```

Result: `The only winning move is not to play.`

### How to Decode Base64

Use the `base64` command with the `-d` flag:

```bash
# Decode a string
echo "SGVsbG8gV29ybGQh" | base64 -d

# Decode a file
base64 -d encoded_file.txt

# Encode text (to create your own)
echo "secret message" | base64
```

### Tips for Finding Encoded Content

1. **Look for suspicious strings** - Base64 often ends with `=` or `==`
2. **Check file contents** - If it looks like random letters/numbers, try decoding
3. **Use grep** to search for base64 patterns:
   ```bash
   grep -r "==$" /home/ 2>/dev/null
   ```

---

## Fun Commands

### cmatrix - Matrix Rain in Terminal

```bash
cmatrix
```

Displays falling Matrix-style characters with quotes from the movie.

### cowsay - ASCII Cow

```bash
cowsay "Hello World"
cowsay -f tux "Linux rules"
```

Available figures: `cow`, `tux`, `daemon`, `dragon`, `ghostbusters`, `stegosaurus`, `vader`

### fortune - Random Quotes

```bash
fortune
```

Returns random hacker quotes, programming wisdom, and tech humor.

### sl - Steam Locomotive

```bash
sl
```

A fun animation when you mistype `ls`.

### lolcat - Rainbow Text

```bash
echo "Hello World" | lolcat
ls | lolcat
fortune | lolcat
```

### figlet - ASCII Art Text

```bash
figlet "HACKED"
figlet "Hello"
```

### banner - Text Banner

```bash
banner "HI"
```

### hack - Fake Hacking Simulation

```bash
hack
```

Displays a Hollywood-style "hacking" animation.

### aquarium - ASCII Fish Tank

```bash
aquarium
```

### coffee - ASCII Coffee Cup

```bash
coffee
```

---

## Movie References

### Hackers (1995)

- **The Gibson** - Ellingson Mineral Company's supercomputer
- **Zero Cool** - Dade Murphy's original handle
- **Acid Burn** - Kate Libby's handle
- **Crash Override** - Dade's new handle
- **"Hack the planet!"** - The rallying cry
- **The Garbage File** - Contains evidence of the oil tanker scheme

Try:
```bash
ssh zerocool@gibson.ellingson.com
cat HACK_THE_PLANET.txt
```

### The Matrix (1999)

- **Neo / The One** - Thomas Anderson
- **Morpheus** - Captain of the Nebuchadnezzar
- **Trinity** - Elite hacker
- **"Follow the white rabbit"** - First message to Neo
- **"There is no spoon"** - Reality is perception

Try:
```bash
ssh neo@matrix.metacortex.com
cat .the_one
```

### WarGames (1983)

- **WOPR** - War Operation Plan Response
- **Joshua** - WOPR's AI, named after Falken's son
- **"Shall we play a game?"** - JOSHUA's famous line
- **"The only winning move is not to play"** - JOSHUA's conclusion

Try:
```bash
ssh joshua@wopr.norad.gov
cat WOPR_README.txt
```

### Mr. Robot (2015)

- **Elliot Alderson** - Protagonist and hacker
- **fsociety** - Hacktivist group
- **E Corp (Evil Corp)** - Mega corporation
- **AllSafe** - Elliot's workplace

Try:
```bash
ssh elliot@fsociety.org
cat fsociety_readme.txt
```

---

## Nmap Scanning Tips

### Discover SSH Hosts

```bash
# Scan common hacker hostnames
nmap gibson.ellingson.com
nmap matrix.metacortex.com
nmap wopr.norad.gov
nmap fsociety.org

# Look for port 22 (SSH)
nmap -p 22 gibson.ellingson.com
```

### Service Detection

```bash
nmap -sV target.com
```

---

## Tips for Exploration

1. **Always use `ls -la`** - Hidden files start with `.`

2. **Check history files**:
   ```bash
   cat ~/.bash_history
   cat ~/.mysql_history
   ```

3. **Explore /etc**:
   ```bash
   ls /etc/
   cat /etc/passwd
   cat /etc/shadow
   ```

4. **Look in home directories**:
   ```bash
   ls /home/
   ls -la /home/*/
   ```

5. **Search for interesting files**:
   ```bash
   find / -name "*.txt" 2>/dev/null
   find / -name "*.conf" 2>/dev/null
   ```

6. **Use grep to search content**:
   ```bash
   grep -r "password" /etc/ 2>/dev/null
   grep -r "secret" /home/ 2>/dev/null
   ```

---

## Challenge Ideas

### Beginner
1. Find your username using `whoami`
2. Navigate to your home directory
3. List all files including hidden ones
4. Read the `/etc/passwd` file

### Intermediate
1. Crack a WiFi password using aircrack-ng
2. SSH into the Gibson and find the garbage file
3. Use `find` to locate all `.txt` files on the system
4. Crack password hashes using john

### Advanced
1. SSH into all four movie-themed hosts
2. Find and read every hidden file on each host
3. Use `nmap` to scan all hosts before connecting
4. Crack all available password hashes
5. Find the flag files hidden in the system

---

## Disclaimer

This terminal simulator is for **educational purposes only**. All "hacking" occurs in a completely simulated environment. No actual networks, systems, or data are accessed or compromised.

The techniques demonstrated here should only be used:
- For learning and education
- On systems you own or have permission to test
- In authorized penetration testing engagements

**Always hack responsibly and legally!**

---

## See Also

- [README.md](README.md) - Main documentation
- [COMMANDS.md](COMMANDS.md) - Complete command reference
