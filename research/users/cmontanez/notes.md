Montanez, Carlos
Tue 6/11/2019 12:34 PM
Hello.
I cannot seem to login-to the MassBuilds database.
Is there a way for staff to access this data from the K drive?
Thanks,


### error:  login form shows "Cannot login at this time"

### rails log:
```
ubuntu@live-mapc-org:/var/www/massbuilds/rails/current/log$ grep cmontanez production.log
D, [2018-04-26T20:03:57.865979 #29656] DEBUG -- :   User Exists (0.6ms)  SELECT  1 AS one FROM "users" WHERE "users"."email" = $1 LIMIT $2  [["email", "cmontanez@mapc.org"], ["LIMIT", 1]]
D, [2018-04-26T20:03:57.870226 #29656] DEBUG -- :   SQL (0.6ms)  INSERT INTO "users" ("id", "email", "encrypted_password", "sign_in_count", "created_at", "updated_at", "authentication_token", "first_name", "last_name") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING "id"  [["id", 266], ["email", "cmontanez@mapc.org"], ["encrypted_password", "$2a$11$EH8rrzJ9020L582Q9MiooOANdrBet9QgQIc4aiWCSaaPK/wlQ1LQC"], ["sign_in_count", 1], ["created_at", "2017-05-16 17:41:15.448929"], ["updated_at", "2018-04-26 20:03:57.868202"], ["authentication_token", "iqcVaqpiw65x8sbiv-3L"], ["first_name", "Carlos"], ["last_name", "Montañez"]]
I, [2018-07-24T17:04:08.015534 #7146]  INFO -- : [85fe0825-d513-4cfa-94f4-05338515858e]   Parameters: {"data"=>{"id"=>"266", "attributes"=>{"email"=>"cmontanez@mapc.org", "password"=>"[FILTERED]", "first_name"=>"Carlos", "last_name"=>"Montañez", "municipality"=>nil, "role"=>"verified", "request_verified_status"=>false, "created_at"=>"2017-05-16T17:41:15.448Z"}, "type"=>"users"}, "id"=>"266"}
I, [2018-07-24T17:04:11.600134 #7146]  INFO -- : [69d54d65-4d0a-48f1-8d11-bae874fcf113]   Parameters: {"data"=>{"id"=>"266", "attributes"=>{"email"=>"cmontanez@mapc.org", "password"=>"[FILTERED]", "first_name"=>"Carlos", "last_name"=>"Montañez", "municipality"=>nil, "role"=>"user", "request_verified_status"=>false, "created_at"=>"2017-05-16T17:41:15.448Z"}, "type"=>"users"}, "id"=>"266"}
I, [2019-06-11T12:30:10.779816 #12231]  INFO -- : [4863f6bf-932b-4d17-a6f6-6fee7414e24c]   Parameters: {"email"=>"cmontanez@mapc.org", "password_reset"=>{"email"=>"cmontanez@mapc.org"}}
I, [2019-06-11T12:30:11.298404 #12231]  INFO -- : [ActiveJob] [ActionMailer::DeliveryJob] [9058d246-5fac-4679-87d1-eda0d04beda9] Sent mail to cmontanez@mapc.org (80.5ms)
I, [2019-06-11T12:30:52.049549 #12231]  INFO -- : [f068455c-999c-461c-87fa-a2fe002cd7e4]   Parameters: {"user"=>{"password"=>"[FILTERED]", "email"=>"cmontanez@mapc.org"}, "session"=>{"user"=>{"password"=>"[FILTERED]", "email"=>"cmontanez@mapc.org"}}}
I, [2019-06-11T12:31:02.896281 #12231]  INFO -- : [957a3450-70d5-4d5a-a16b-9885efe6c962]   Parameters: {"user"=>{"password"=>"[FILTERED]", "email"=>"cmontanez@mapc.org"}, "session"=>{"user"=>{"password"=>"[FILTERED]", "email"=>"cmontanez@mapc.org"}}}
I, [2019-06-11T12:31:08.383011 #12231]  INFO -- : [43aba5ad-6f7e-4d78-be9f-dffb91ae7819]   Parameters: {"user"=>{"password"=>"[FILTERED]", "email"=>"cmontanez@mapc.org"}, "session"=>{"user"=>{"password"=>"[FILTERED]", "email"=>"cmontanez@mapc.org"}}}
I, [2019-06-11T12:34:35.681917 #12231]  INFO -- : [bedf4810-9837-493d-ab2a-2a5de2051c86]   Parameters: {"user"=>{"password"=>"[FILTERED]", "email"=>"cmontanez@mapc.org"}, "session"=>{"user"=>{"password"=>"[FILTERED]", "email"=>"cmontanez@mapc.org"}}}
ubuntu@live-mapc-org:/var/www/massbuilds/rails/current/log$
```

### see /ubuntu/syslog-jun-11
snippet:

```
Jun 11 11:54:36 live-mapc-org systemd[1]: mnt.mount: Job mnt.mount/start failed with result 'dependency'.
Jun 11 11:54:36 live-mapc-org systemd[1]: systemd-fsck@dev-xvdb.service: Job systemd-fsck@dev-xvdb.service/start failed with result 'dependency'.
Jun 11 11:54:36 live-mapc-org systemd[1]: dev-xvdb.device: Job dev-xvdb.device/start failed with result 'timeout'.
Jun 11 11:55:01 live-mapc-org CRON[5841]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Jun 11 12:05:01 live-mapc-org CRON[6126]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Jun 11 12:15:01 live-mapc-org CRON[6410]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Jun 11 12:19:41 live-mapc-org dhclient[703]: DHCPREQUEST of 10.0.0.170 on eth0 to 10.0.0.1 port 67 (xid=0x453eeec5)
Jun 11 12:19:41 live-mapc-org dhclient[703]: DHCPACK of 10.0.0.170 from 10.0.0.1
Jun 11 12:19:41 live-mapc-org systemd[1]: Stopping Network Name Resolution...
Jun 11 12:19:41 live-mapc-org systemd[1]: Stopped Network Name Resolution.
Jun 11 12:19:41 live-mapc-org systemd[1]: Starting Network Name Resolution...
Jun 11 12:19:41 live-mapc-org systemd-resolved[6548]: Positive Trust Anchors:
Jun 11 12:19:41 live-mapc-org systemd-resolved[6548]: . IN DS 19036 8 2 49aac11d7b6f6446702e54a1607371607a1a41855200fd2ce1cdde32f24e8fb5
Jun 11 12:19:41 live-mapc-org systemd-resolved[6548]: . IN DS 20326 8 2 e06d44b80b8f1d39a95c0b0d7c65d08458e880409bbc683457104237c7f8ec8d
Jun 11 12:19:41 live-mapc-org systemd-resolved[6548]: Negative trust anchors: 10.in-addr.arpa 16.172.in-addr.arpa 17.172.in-addr.arpa 18.172.in-addr.arpa 19.172.in-addr.arpa 20.172.in-addr.arpa 21.172.in-addr.arpa 22.172.in-addr.arpa 23.172.in-addr.arpa 24.172.in-addr.arpa 25.172.in-addr.arpa 26.172.in-addr.arpa 27.172.in-addr.arpa 28.172.in-addr.arpa 29.172.in-addr.arpa 30.172.in-addr.arpa 31.172.in-addr.arpa 168.192.in-addr.arpa d.f.ip6.arpa corp home internal intranet lan local private test
Jun 11 12:19:41 live-mapc-org systemd-resolved[6548]: Using system hostname 'live-mapc-org'.
Jun 11 12:19:41 live-mapc-org systemd[1]: Started Network Name Resolution.
Jun 11 12:19:41 live-mapc-org systemd[1]: Starting resolvconf-pull-resolved.service...
Jun 11 12:19:41 live-mapc-org dhclient[703]: bound to 10.0.0.170 -- renewal in 1527 seconds.
Jun 11 12:19:41 live-mapc-org systemd[1]: Started resolvconf-pull-resolved.service.
Jun 11 12:21:11 live-mapc-org systemd[1]: dev-xvdb.device: Job dev-xvdb.device/start timed out.
Jun 11 12:21:11 live-mapc-org systemd[1]: Timed out waiting for device dev-xvdb.device.
Jun 11 12:21:11 live-mapc-org systemd[1]: Dependency failed for File System Check on /dev/xvdb.
Jun 11 12:21:11 live-mapc-org systemd[1]: Dependency failed for /mnt.
Jun 11 12:21:11 live-mapc-org systemd[1]: mnt.mount: Job mnt.mount/start failed with result 'dependency'.
Jun 11 12:21:11 live-mapc-org systemd[1]: systemd-fsck@dev-xvdb.service: Job systemd-fsck@dev-xvdb.service/start failed with result 'dependency'.
Jun 11 12:21:11 live-mapc-org systemd[1]: dev-xvdb.device: Job dev-xvdb.device/start failed with result 'timeout'.
Jun 11 12:25:01 live-mapc-org CRON[6756]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Jun 11 12:35:01 live-mapc-org CRON[7252]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Jun 11 12:35:54 live-mapc-org systemd[1]: Starting Message of the Day...
Jun 11 12:35:54 live-mapc-org 50-motd-news[7279]:  * Ubuntu's Kubernetes 1.14 distributions can bypass Docker and use containerd
Jun 11 12:35:54 live-mapc-org 50-motd-news[7279]:    directly, see https://bit.ly/ubuntu-containerd or try it now with
Jun 11 12:35:54 live-mapc-org 50-motd-news[7279]:      snap install microk8s --classic
Jun 11 12:35:54 live-mapc-org systemd[1]: Started Message of the Day.
```
