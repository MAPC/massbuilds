
## Issue arising from upgrade of Ubuntu from 16.04 to 18.04 (from Xenial to Bionic)


### [Stopping Network Name Resolution](https://unix.stackexchange.com/questions/486414/why-is-systemd-resolved-restarting-frequently)

excerpt:
```
If a cloud server is upgraded from Xenial to Bionic, the dhclient system remains in place and any DHCP lease refreshes cause a needless restart of the system-resolved daemon**
```

- [bug report that might be relevent](https://bugs.launchpad.net/ubuntu/+source/systemd/+bug/1805183)

- [patch referenced in above bug report](https://bugs.launchpad.net/ubuntu/+source/systemd/+bug/1805183/comments/8)


Production is on "BIONIC", and has the issue of restart every 24 minutes.
Staging is still on "XENIAL", and does not have this issue.


### about our Ubuntu servers:

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


 This set of 3 events occurs approximately every 24 minutes.

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
```
