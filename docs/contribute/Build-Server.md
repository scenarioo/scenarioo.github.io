# Scenarioo CI/CD Build and Demo Server

## Jenkins CI/CD Build Server

http://ci.scenarioo.org or http://build.scenarioo.org (both forward to http://54.88.202.24/jenkins)

The server is maintained by adiherzog. Contact him if you need a Jenkins account.

## Demos

Latest release: http://demo.scenarioo.org

Development for future release: http://demo.scenarioo.org/scenarioo-develop

Your special feature or release branch (if it has a CI/CD-build-job): http://demo.scenarioo.org/scenarioo-{branch-name}

## Add new CI/CD build job for new branch

* Click "New Item" in the Jenkins menu
* Set the name of the new build job to "scenarioo-{my-branch-name}"
* Select "Copy existing Item" and enter "scenarioo-develop" or "scenarioo-master" (depending on from where you branched) as the base item.
* Click "Ok"
* Set the correct branch next to "Branches to build"
* In the post-build task where the "deploy-demo-and-run-e2e-tests" task is called, set "BRANCH={my-branch-name}".
* It's important that you use exactly the same {my-branch-name} values for both occurrences. It does not have to be the exact git branch name, but it should identify the branch. Only use alphanumeric characters and the dash in {my-branch-name}. Otherwise you may run into problems.
* Save it
* Choose to build once: "Build Now"
* First run of the build run will usually fail (there seems to be a problem with clean build currently).
* Choose to build again, usually the second build should succeed.
* The demo once deployed should be available under: http://demo.scenarioo.org/scenarioo-{my-branch-name}

## Nginx Proxy Configurations

Modifying NGINX proxy configuration files to redirect URLs on our demo/build server, can be done as follows:

0. All the config files are found on the demo VM in following directory:
/etc/nginx/sites-available

1. Download/Upload config files
    * Use SCP to copy files
      * from server: `scp ubuntu@54.88.202.24:/etc/nginx/sites-available/* .`
      * to server: `scp ./* ubuntu@54.88.202.24:/home/ubuntu/upload/sites-available`
    * On windows use putty, pageant and pscp (all from putty)
      * register the key for the VM with pageant
      * then use pscp in same way as scp (see above)

3. SSH to VM and copy the files from uploaded place to /etc/nginx/sites-available
> cd ~/upload/sites-available
> sudo cp ./<changed-file> /etc/nginx/sites-available/<changed-file>

4. Only in case of a new config file: Generate link for new server files in `sites-enabled`:
> sudo ln -s /etc/nginx/sites-available/<name-of-new-server-file> /etc/nginx/sites-enabled/

5. Restart the NGINX Server
> sudo service nginx restart

## Setup of build server

There are a number of aliases defined in the .bash_aliases file of the ubuntu user. They all start with `sc-` and lead to the Tomcat, Jenkins and the Scenarioo data directories.

### Restart tomcat manually

1. SSH to the demo server:
> ssh -i .ssh/Scenarioo-Keypair.pem ubuntu@54.88.202.24  
(you need the key for that! ask one of the Leads if you need it)

2. Stop and start tomcat:
> sudo service tomcat7 stop  
> sudo service tomcat7 start  

### Automatic Restart of Tomcat

Jenkins build 'smoketest' checks every 5 minutes if the demo (on master and develop) is currently available.
(ATTENTION! this job is currently disabled and we should reactivate it and introduce an email on failure to lead devs)

Two cronjobs are defined:

1. 6 o clock in the morning: restart tomcat

2. every 15 minutes: restart tomcat if special jenkins job 'smoketest' failed (REMARK: might be not optimal, because the smoketest might fail because of parallel running deployment?)

Too see all defined cronjobs:


```
> sudo crontab -l

0 6 * * * service tomcat7 restart

*/15 * * * * /root/restart_tomcat_if_smoketest_failed 
```

## Setup of e2e tests on build server

![End to End Tests Scenarioo Protractor](https://cloud.githubusercontent.com/assets/3780183/8078418/fe24f0b6-0f5d-11e5-87f2-1b738bc68d57.png)
