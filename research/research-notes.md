
### about our Ubuntu server:

### staging:
NAME="Ubuntu"
VERSION="16.04.6 LTS (Xenial Xerus)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 16.04.6 LTS"
VERSION_ID="16.04"
HOME_URL="http://www.ubuntu.com/"
SUPPORT_URL="http://help.ubuntu.com/"
BUG_REPORT_URL="http://bugs.launchpad.net/ubuntu/"
VERSION_CODENAME=xenial
UBUNTU_CODENAME=xenial

### production
 * ubuntu@live-mapc-org:~$ cat /etc/os-release
 * NAME="Ubuntu"
 * VERSION="18.04.1 LTS (Bionic Beaver)"
 * ID=ubuntu
 * ID_LIKE=debian
 * PRETTY_NAME="Ubuntu 18.04.1 LTS"
 * VERSION_ID="18.04"
 * HOME_URL="https://www.ubuntu.com/"
 * SUPPORT_URL="https://help.ubuntu.com/"
 * BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
 * PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
 * VERSION_CODENAME=bionic
 * UBUNTU_CODENAME=bionic
 * ubuntu@live-mapc-org:~$



### attempting to save log files locally for analysis
```
ubuntu@live-mapc-org:/var/www/massbuilds/rails/current/log$ script
Script started, file is typescript
script: cannot open typescript: Permission denied
ubuntu@live-mapc-org:/var/www/massbuilds/rails/current/log$

can't save logs locally
can't use script
```


## errors

### [Error on AWS server: Is “dev-xvdb.device: Job dev-xvdb.device/start timed out” harmless?](https://askubuntu.com/questions/1061726/error-on-aws-server-is-dev-xvdb-device-job-dev-xvdb-device-start-timed-out-h)

### [Stopping Network Name Resolution](https://unix.stackexchange.com/questions/486414/why-is-systemd-resolved-restarting-frequently)

- [bug report that might be relevent](https://bugs.launchpad.net/ubuntu/+source/systemd/+bug/1805183)

- [patch referenced in above bug report](https://bugs.launchpad.net/ubuntu/+source/systemd/+bug/1805183/comments/8)


**[Original bug report]
If a cloud server is upgraded from Xenial to Bionic, the dhclient system remains in place and any DHCP lease refreshes cause a needless restart of the system-resolved daemon**

We are on "BIONIC" now, check if this issue started happening after upgrade from Xenial to Bionic. And, staging is still on "XENIAL".


```
Jun 11 12:19:41 live-mapc-org systemd[1]: Stopping Network Name Resolution...
Jun 11 12:19:41 live-mapc-org systemd[1]: Stopped Network Name Resolution.
Jun 11 12:19:41 live-mapc-org systemd[1]: Starting Network Name Resolution...
```

  cmontanez had his issue around this time, emailing us at 12:34pm Jun 11
  Montanez, Carlos
  Tue 6/11/2019 12:34 PM
  Hello.
  I cannot seem to login-to the MassBuilds database.
  Is there a way for staff to access this data from the K drive?
  Thanks,
  Carlos









## ideas

### install an http logger:  https://manpages.ubuntu.com/manpages/bionic/en/man1/httpry.1.html

### start capturing http traffic for analysis
       httpry is a tool designed for displaying and logging HTTP traffic. It is not  designed  to
       perform  analysis  itself,  but  instead  to  capture, parse and log the traffic for later
       analysis. It can be run in real-time displaying the live traffic on  the  wire,  or  as  a
       daemon process that logs to an output file.

### route all massbuilds problems to a central place
- slack channel for massbuilds

### add an error response form to gather more info
- type of user
- actions they took
- what they expected
- what they experienced

### isolate Ubuntu issues that:
- 1 don't have anything to do with massbuilds
- 2 could possibly influence massbuilds
- 3 affect massbuilds
