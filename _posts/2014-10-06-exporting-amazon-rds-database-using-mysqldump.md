---
title: Exporting Amazon RDS database using mysqldump
layout: post
---

Getting MySQL data out from Amazon RDS databases is frustratingly hard and makes you want to kill yourself when it finally works without the port number.


## mysqldump

`mysqldump` is the command-line tool used to get a complete data dump from MySQL databases, including its table structure.

I installed it simply with `brew install mysql` in Mac OSX.


## Amazon RDS

Go to [Amazon RDS Console](https://console.aws.amazon.com/rds/) and get to your DB instance.

Note the `Username`, `DB Name`, and `Endpoint` of the instance from here.

If you don't remember the `Master Password` you chose when creating this DB instance, then change it by right-clicking the instance and selecting `Modify`. There is a field for `New Master Password` there.

Next, check out the instance's security groups and open one of the security groups by clicking on it.

In the security groups's settings, open the Inbound tab, and allow MYSQL (`3306`) port range there.


## Dump

Now open the terminal and type in this, filling in the placeholders with your own values:

```bash
$ mysqldump <DB Name> -h <Endpoint> -u <Username> -p<Master Password> -P 3306 > rds.sql
```

This should save the complete database dump into `rds.sql`, which is ready to be exported to another MySQL server and life goes on.

If only life were that easy..
Things that will trip you hard in that last command unless you ensure:

- No port number at the end of `Endpoint`
- No space between `-p` and `Master Password`
- DB instance has the property `Publicly Accessible` set to `true` (visible when you select the instance)

I was bitten by 2 out of the 3 gotchas above. Just saying, Amazon.