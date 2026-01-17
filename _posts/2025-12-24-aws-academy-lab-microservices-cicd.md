---
layout: post
title: "AWS Academy Lab: Microservices & CI/CD"
date: 2025-12-24 10:00:00 +0500
categories: [Labs, AWS]
tags: [cloud, aws, devops, microservices, cicd]
description: "Deep dive into AWS Academy lab on breaking down monolithic applications into microservices with CI/CD."
---

 # Coffee Suppliers Microservices Architecture Project

**Date:** December 12, 2025

## Scenario

The owners of a café corporation with many franchise locations have
noticed how popular their gourmet coffee offerings have become.
>
*Customers* (the café franchise location managers) cannot seem to get
enough of the high-quality coffee beans that are needed to create
amazing cappuccinos and lattes in their cafés.
>
Meanwhile, the *employees* in the café corporate office have been
challenged to consistently source the highest-quality coffee beans.
Recently, the leaders at the corporate office learned that one of
their favorite coffee suppliers wants to sell her company. The café
corporate managers jumped at the opportunity to buy the company. The
acquired coffee supplier runs a coffee supplier listings application
on an AWS account, as shown in the following image.

![Current monolithic application architecture showing AWS infrastructure]({{ site.baseurl }}/assets/img/posts/image1.jpeg)

The coffee suppliers application currently runs as a *monolithic*
application. It has reliability and performance issues. That is one of
the reasons that you have recently been hired to work in the cafÃ©
corporate office. In this project, you perform tasks that are
associated with software development engineer (SDE), app developer,
and cloud support engineer roles.
>
You have been tasked to split the monolithic application into
*microservices*, so that you can scale the services independently and
allocate more compute resources to the services that experience the
highest demand, with the goal of avoiding bottlenecks. A microservices
design will also help avoid single points of failure, which could
bring down the entire application in a monolithic design. With
services isolated from one another, if one microservice becomes
temporarily unavailable, the other microservices might remain
available.

## Solution Requirements

 The solution must meet the following requirements:

- **R1 - Design:** The solution must have an architecture diagram.
- **R2 - Cost Optimized:** The solution must include a cost estimate.
- **R3 - Microservices-based Architecture:** Ensure that the solution is functional and deploys a microservice-based architecture.
- **R4 - Portability:** The solution must be portable so that the application code isn't tied to running on a specific host machine.
- **R5 - Scalability/Resilience:** The solution must provide the ability to increase the amount of compute resources that are dedicated to serving requests as usage patterns change, and the solution must use routing logic that is reliable and scalable.
- **R6 - Automated CI/CD:** The solution must provide a CI/CD pipeline that can be automatically invoked when code is updated and pushed to a version-controlled code repository.

## Approach

![Solution architecture diagram showing microservices and cloud infrastructure]({{ site.baseurl }}/assets/img/posts/image3.jpeg)

## Phase 2: Analyzing the Infrastructure of the Monolithic Application

In this phase, I will analyze the current application infrastructure and then test the web application.

### Task 2.1: Verify that the Monolithic Application is Available

- Go to AWS Console
- Find the instance named `MonolithicApp`  
- Copy the public IPv4 address

![EC2 instance management console showing MonolithicApp instance]({{ site.baseurl }}/assets/img/posts/image4.jpeg)
>
My MonolithicApp is already running with the public IPv4 address shown above.
>
Copy the IPv4 address and open a new browser tab, entering it as the URL. In this example: `35.171.28.188`
>
**Expected Behavior:**
- Page loads using HTTP (not HTTPS)
- Browser might show a security warning - ignore it

![Web browser showing secure connection warning message]({{ site.baseurl }}/assets/img/posts/image5.jpeg)

Home page of website is visible.

### Task 2.2: Test the Monolithic Web Application

In this task, we will add data to the web application, test the functionality, and observe the different URL paths that are used to display the different pages. These URL paths are important to understand for when you divide this application into microservices later.

1. **Choose Suppliers**

![Coffee suppliers page interface showing list of suppliers]({{ site.baseurl }}/assets/img/posts/image6.jpeg)

Notice that the URL path includes `/suppliers`

2. **Add a New Supplier**

![Add supplier form with fields for company information]({{ site.baseurl }}/assets/img/posts/image7.jpeg)

Fill the form with any values and submit. Notice that the URL path includes `/supplier-add`.

3. **Edit a Supplier**

Select a supplier's edit button:

![Suppliers list showing edit button for each entry]({{ site.baseurl }}/assets/img/posts/image8.jpeg)

Select the edit button.
>
![Edit supplier form for updating company details]({{ site.baseurl }}/assets/img/posts/image9.jpeg)
>
Notice that the URL path now includes `supplier-update/1`.
>
Change any field and save:

![Supplier update form with modified address field]({{ site.baseurl }}/assets/img/posts/image10.jpeg)

The address was changed.
>
![Confirmation message showing supplier changes saved successfully]({{ site.baseurl }}/assets/img/posts/image11.jpeg)
>
Changes saved successfully.

# Task 2.3: Analyze how the monolithic application runs

After Task 2.2 works, continue:

1.  **Use EC2 Instance Connect to Connect to the Instance**

Open EC2 Instance Connect, Select **MonolithicAppServer â†’ Connect â†’ EC2 Instance Connect** â†’ "Connect"

![EC2 instance management console showing MonolithicApp instance]({{ site.baseurl }}/assets/img/posts/image12.jpeg)

click on connect.

![Image 13]({{ site.baseurl }}/assets/img/posts/image13.jpeg)

Keep everything as default and click on connect.
>
![Image 14]({{ site.baseurl }}/assets/img/posts/image14.jpeg)
>
A new tab will open with a terminal.

2.  Analyze how the application is running.

In the terminal session, run the following command: sudo lsof -i :80

![Image 15]({{ site.baseurl }}/assets/img/posts/image15.jpeg)

This shows important information about what's running on port 80 of
the EC2 instance:
>
Q: What did you notice in the command output? What port and protocol
is the *node* daemon using?
>
Answer: The Node.js application is running on port 80 using the TCP
protocol. In Next, run the following command: ps -ef \| head -1; ps
-ef \| grep node
>
![Image 16]({{ site.baseurl }}/assets/img/posts/image16.jpeg)
>
This command shows process information.
>
Q: What did you notice in the command output? Which user on this EC2
instance is running a *node* process? Does the node process ID (PID)
match any of the PIDs from the output of the command that you ran
before the last one?
>
The root user runs the Node process. The PID 15099 matches the PID
from the previous lsof
>
command.

3.  To analyze the application structure, run the following commands:

\~/resources/codebase_partner

![Image 17]({{ site.baseurl }}/assets/img/posts/image17.jpeg)

This is where the index.js file exists. It contains the base
application logic.
>
**Questions for thought:** Based on what you have observed, what can
you determine about how and where this node application is running?
How do you think it was installed? What prerequisite libraries, if
any, were required to make it run? Where does the application store
data?
>
Answer:
>
How/Where: Node.js app runs directly on EC2 (port 80) as root via node
index.js. Installation: Likely cloned from Git and installed via npm
install.
>
Prerequisites: Node.js runtime and dependencies in node_modules. Data
Storage: External RDS MySQL database (not local).

4.  Connect a MySQL client to the RDS database that the node application
    stores data in.

Find and copy the endpoint of the RDS database that is running in the
lab environment.
>
Go to AWS console â†’ RDS â†’ Databases Copy the **Endpoint**.
>
![Image 18]({{ site.baseurl }}/assets/img/posts/image18.jpeg)
>
Copy this endpoint.
>
To verify that the database can be reached from the instance on the
standard MySQL port number, use the nmap -Pn command with the RDS
database endpoint that you copied.
>
Back in EC2 terminal:
>
Check port connectivity: nmap -Pn ENDPOINT

![Image 19]({{ site.baseurl }}/assets/img/posts/image19.jpeg)

Database Verification: RDS endpoint is accessible on port 3306
(MySQL), confirming connectivity from the EC2 instance to the
database.
>
To connect to the database, use the MySQL client that is already
installed on the instance. Use the following values: admin
lab-password
>
Command: mysql -h Endpoint -u admin -p

![Image 20]({{ site.baseurl }}/assets/img/posts/image20.jpeg)

Database logged in.

5.  Observe the data in the database.

From the mysql\> prompt, run SQL commands as appropriate to see that a
database named contains a table named .
>
This table contains the supplier entry or entries that you added
earlier when you tested the web application.
>
Inside MySQL, run:
>
SHOW DATABASES;
>
USE COFFEE;
>
SHOW TABLES;
>
SELECT \* FROM suppliers;

![Image 21]({{ site.baseurl }}/assets/img/posts/image21.jpeg)

Running SQL queries.
>
Exit the MySQL client and then close the EC2 Instance Connect tab.
Also close the coffee suppliers web application tab.

![Image 22]({{ site.baseurl }}/assets/img/posts/image22.png)

This marks completion of Phase 2.

## References

- [[Connect to Your Linux Instance with EC2 Instance
  Connect]{.underline}](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Connect-using-EC2-Instance-Connect.html)

- [[Connecting from the MySQL Command-Line Client]{.underline}
  ([Unencr]{.underline}yp[ted]{.underline})](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToInstance.html#USER_ConnectToInstance.CLI)

- For information about the lsof, ps, grep, and nmap commands, see the
  [[Linux Man Pages]{.underline}](https://linux.die.net/man) [[on
  linux.die.net]{.underline}](https://linux.die.net/man).

# Phase 3: Creating a development environment and checking code into a Git repository

In this phase, we will create a development environment by using AWS
Cloud9. We will also check your application code into AWS CodeCommit,
which is a Git-compatible repository.
>
**Task 3.1: Create an AWS Cloud9 IDE as your work environment**
>
1\. Create an AWS Cloud9 instance that is named MicroservicesIDE and
then open the IDE..
>
Do this AWS account:
>
Go to **AWS Console â†’ Cloud9** Click **Create environment**

![Image 24]({{ site.baseurl }}/assets/img/posts/image24.jpeg)

Click on create environment.
>
![Image 25]({{ site.baseurl }}/assets/img/posts/image25.jpeg)
>
Fill it as per instructions.
>
It should run as a new EC2 instance of size *t3.small* and run Amazon
Linux 2. The instance should support SSH connections and run in the
*LabVPC* in *Public Subnet1*
>
Click on create:

![Image 26]({{ site.baseurl }}/assets/img/posts/image26.jpeg)

Press click.
>
After a minute or two, the IDE opens with a terminal and file tree on
the left.

![Image 27]({{ site.baseurl }}/assets/img/posts/image27.jpeg)

Just wait here.

![Image 28]({{ site.baseurl }}/assets/img/posts/image28.jpeg)

Successfully created.

# Task 3.2: Copy the application code to your IDE

In this task, we will copy the source code for the monolithic
application to your development environment.

1.  From the panel on this lab instructions page, download the file to
    your local computer.

![Image 29]({{ site.baseurl }}/assets/img/posts/image29.jpeg)
>
click on download PEM to download labsuser.pem

2.  Upload the .pem file to your AWS Cloud9 IDE, and use the Linux chmod
    command to set the [[proper
    permissions]{.underline}](https://repost.aws/questions/QUsZqMJGVtQmemkEMVwxUiIw/why-should-i-change-the-permissions-on-the-ssh-pem-file)
    on the file so that you can use it to connect to an EC2 instance.

![Image 30]({{ site.baseurl }}/assets/img/posts/image30.jpeg)

click on Open cloud9 IDE
>
![Image 31]({{ site.baseurl }}/assets/img/posts/image31.jpeg)
>
Lets upload labsuser.pem.
>
Click on Upload Local Files â†’ select **labsuser.pem**
>
It should appear in the left file tree under MicroservicesIDE.

![Image 32]({{ site.baseurl }}/assets/img/posts/image32.png)

Next set correct permissions
>
Run this in Cloud9 terminal: chmod 400 \~/environment/labsuser.pem

![Image 33]({{ site.baseurl }}/assets/img/posts/image33.jpeg)

3.  Create a temp directory on the AWS Cloud9 instance at
    /home/ec2-user/environment/temp.

![Image 34]({{ site.baseurl }}/assets/img/posts/image34.jpeg)

![Image 35]({{ site.baseurl }}/assets/img/posts/image35.png)

temp directory visible here.

4.  From the Amazon EC2 console, retrieve the private IPv4 address of
    the

*MonolithicAppServer* instance.
>
Now we need to get private IP of MonolithicAppServer. Go to:
>
AWS Console â†’ EC2 â†’ Instances â†’ MonolithicAppServer Copy **Private
IPv4 address**

![Image 36]({{ site.baseurl }}/assets/img/posts/image36.jpeg)

In my case private ip is 10.16.10.104.

5.  Use the Linux
    [[scp]{.underline}](https://docs.aws.amazon.com/managedservices/latest/appguide/qs-file-transfer.html)
    command in the Bash terminal on the AWS Cloud9 instance to copy the
    source code for the node application from the *MonolithicAppServer*
    instance to the temp directory that you created on the AWS Cloud9
    instance.

The following snippet provides an example scp command:
>
scp -r -i \~.pem ubuntu@ \~
>
Replace \<PRIVATE-IP\> with the IP you copied:
>
command for me becomes:
>
![Image 37]({{ site.baseurl }}/assets/img/posts/image37.jpeg)

![Image 38]({{ site.baseurl }}/assets/img/posts/image38.jpeg)

As you can see now our temp folder has contents.

6.  In the file browser of the IDE, verify that the source files for the
    application have been copied to the temp directory on the AWS Cloud9
    instance.

![Image 39]({{ site.baseurl }}/assets/img/posts/image39.png)
>
![Image 40]({{ site.baseurl }}/assets/img/posts/image40.png)
>
Now our temp folder contains contents.

# Task 3.3: Create working directories with starter code for the two microservices

In this task, we will create areas in your development environment to
support separating the application logic into two different
microservices.
>
Based on the solution requirements of this project, it makes sense to
split the monolithic application into two microservices. We will name
the microservices *customer* and *employee*.
>
The following table explains the functionality that is needed for each
microservice.

![Image 41]({{ site.baseurl }}/assets/img/posts/image41.jpeg)

![Image 42]({{ site.baseurl }}/assets/img/posts/image42.jpeg)

The employee microservice will eventually be made available only to
employees. We will accomplish this by first encapsulating them as a
separate microservice (in phases 3 and 4 of the project), and then
later in phase 9 of the project, We will limit who can access the
employee microservice.

1.  In the directory, create two new directories that are named customer
    and employee.

In Cloud9 terminal, run:
>
mkdir -p \~/environment/microservices/customer mkdir -p
\~/environment/microservices/employee

![Image 44]({{ site.baseurl }}/assets/img/posts/image44.jpeg)

These commands create customer and employee directory.

![Image 45]({{ site.baseurl }}/assets/img/posts/image45.png)

Directory structure now

2.  Place a copy of the source code for the monolithic application in
    each new directory, and remove the files from the **temp**
    directory.

To copy the code into both:
>
cp -r \~/environment/temp/\* \~/environment/microservices/customer/ cp
-r \~/environment/temp/\* \~/environment/microservices/employee/
>
Then delete temp folder: rm -rf \~/environment/temp
>
![Image 46]({{ site.baseurl }}/assets/img/posts/image46.jpeg)
>
![Image 47]({{ site.baseurl }}/assets/img/posts/image47.png)
>
This should be the directory now.

# Task 3.4: Create a Git repository for the microservices code and push the code to CodeCommit

We now have directories named *customer* and *employee*, and each will
contain a microservice. The two microservices will replicate the logic
in our monolithic application. However, we will also be able to evolve
the application functionality and to time the deployment of feature
enhancements for these microservices separately.
>
We will benefit from checking this source code into a Git repository.
In this project, we will use CodeCommit as our Git repository (repo).
>
1\. Create a CodeCommit repository that is named microservices.
>
AWS Console â†’ CodeCommit â†’ Create repository â†’ **microservices**

![Image 48]({{ site.baseurl }}/assets/img/posts/image48.jpeg)

Here click on create repository.
>
![Image 49]({{ site.baseurl }}/assets/img/posts/image49.jpeg)
>
Press create.

![Image 50]({{ site.baseurl }}/assets/img/posts/image50.jpeg)

Succesfuly created.
>
In cloud9 terminal run these: cd \~/environment/microservices
>
git
>
git branch -m dev git .
>
git m
>
git remote add origin
[https://git-codecommit.us-east-](https://git-codecommit.us-east/)1.amazonaws.com/v1/repos/microservices
>
git -u origin dev
>
Final cloud9 terminal will be:

![Image 51]({{ site.baseurl }}/assets/img/posts/image51.jpeg)

cloud9 terminal after running the above commands.
>
By running these commands, we first *initialized* the microservices
directory to be a Git repository. Then, we created a *branch* in the
repository named *dev*. We *added* all files from the microservices
directory to the Git repository and *committed* them. Then, we defined
the microservices repository that you created in CodeCommit as the
*remote origin* of this Git repository area on our IDE. Finally, we
*pushed* the changes that were committed in the *dev* branch to the
remote origin.

3.  Configure your Git client to know your username and email address

**Note:** You don't need to use your real name or email address;
however, completing this step is an important part of configuring a
Git client.
>
Example:
>
git config --- global user.name "student"
>
git config --- global user.email
"[[studen]{.underline}t@[example.com]{.underline}](mailto:student@example.com)"

![Image 52]({{ site.baseurl }}/assets/img/posts/image52.png)

4.  In a new browser tab, browse to the CodeCommit console and observe
    that the code is now checked into your microservices repository.

Go to CodeCommit â†’ microservices â†’ you should see:

- customer directory

- employee directory

- all code files

![Image 53]({{ site.baseurl }}/assets/img/posts/image53.jpeg)

Code is visible in our repository.
>
This marks the completion of Phase 3.

# Phase 4: Configuring the application as two microservices and testing them in Docker containers

In this phase, we will modify the two copies of the monolithic
application starter code so that the application functionality is
implemented as two separate microservices. Then, for initial testing
purposes, we will run the containers on the same EC2 instance that
hosts the AWS Cloud9 IDE that we are using. We will use this IDE to
build the Docker images and launch the Docker containers.

# Task 4.1: Adjust the AWS Cloud9 instance security group settings

In this phase of the project, we will use the AWS Cloud9 instance as
our test environment. We will run Docker containers on the instance to
test the microservices that we will create. To be able to access the
containers from a browser over the internet, we must open the ports
that you will run the containers on.
>
1\. Adjust the security group of the AWS Cloud9 EC2 instance to allow
inbound network traffic on TCP ports 8080 and 8081.
>
Go to **AWS Console â†’ EC2.**
>
Find the EC2 instance that Cloud9 created (name will contain your
Cloud9 environment, e.g.,
>
*aws-cloud9-MicroservicesIDE*).
>
![Image 54]({{ site.baseurl }}/assets/img/posts/image54.jpeg)
>
cloud9 instance.
>
Select the instance and go to the security and click on security
group.

![Image 55]({{ site.baseurl }}/assets/img/posts/image55.jpeg)

Click on the blue link below security group
>
Choose **Edit inbound rules**
>
![Image 56]({{ site.baseurl }}/assets/img/posts/image56.jpeg)
>
Add two new tcp rules:

![Image 57]({{ site.baseurl }}/assets/img/posts/image57.jpeg)

Save rules.

# Task 4.2: Modify the source code of the customer microservice

In this task, we will edit the source code for the *customer*
microservice. Recall that the source code you are starting with is an
exact copy of the monolithic application. Therefore, it still has
features in it that will be handled by the employee microservice and
that we don't want as part of the customer microservice. Specifically,
customers shouldn't have the ability to add, edit, or delete
suppliers; therefore, the changes that we make will remove that
functionality from the source code. Ideally, the source code should
contain only code that is needed.

1.  In the AWS Cloud9 file panel, the directory, if it is expanded, and
    then the directory.

![Image 59]({{ site.baseurl }}/assets/img/posts/image59.jpeg)

2.  Edit the customer/app/controller/**supplier.controller.js** file so
    that the remaining functions provide only the read-only actions that
    you want customers to be able to perform.

**Tip:** After you edit the file, it should contain only the following
lines:
>
= (); {body, validationResult} = (); . = { .( { (err) res. (, {: });
res.(, {: data}); }); }; . = { .(req.., { (err) { (err. === ) {
res.().({ : });
>
} { res.(, {: }); } } res.(, {: data}); });
>
};
>
Open the customer/app/controller/supplier.controller.js
>
![Image 60]({{ site.baseurl }}/assets/img/posts/image60.jpeg)
>
Final content of supplier.controller.js.

3.  Edit the customer/app/models/**supplier.model.js** file. Delete the
    unnecessary functions in it so that what remains are only read-only
    functions.

**Important:** *KEEP* the last line of the file: module.exports =
Supplier;
>
**Note:** The model should still contain two functions:
Supplier.getAll and Supplier.findById. Keep ONLY:

- Supplier.getAll

- Supplier.findById

- The final line: module.exports = Supplier;

- Delete everything else.

![Image 61]({{ site.baseurl }}/assets/img/posts/image61.jpeg)
>
Final content of

4.  Later in the project, when you deploy the microservices behind an
    Application Load Balancer, you will want *employees* to be able to
    navigate from the main *customer* page to the area of the web
    application where they can add, edit, or delete supplier entries. To
    support this, edit the customer/views/**nav.html** file:

    - On line 3, change Monolithic Coffee suppliers to Coffee suppliers

    - On line 7, change Home to Customer home

    - Add a new line line 8 that contains the following HTML:

    - delete or overwrite any of the existing lines in the file.

    - \<a class="nav-link" href="/admin/suppliers"\>Administrator
      link\</a\>

    - Adding this link will provide a navigation path to those pages
      that will be hosted under the

/admin/ URL path.
>
Edit customer/views/nav.html:
>
![Image 62]({{ site.baseurl }}/assets/img/posts/image62.jpeg)
>
final content of nav.html

5.  You don't want customers to see the **Add a new supplier** button or
    any **edit** buttons next to supplier rows. To implement these
    changes, edit the customer/views/**supplier-list-all.html** file:

    - Remove line 32, which contains Add a new supplier.

    - Remove lines 26 and 27, which contain badge badge-info and
      supplier-update.

![Image 63]({{ site.baseurl }}/assets/img/posts/image63.jpeg)
>
final content of

6.  Because the customer microservice doesn't need to support read-write
    actions, *DELETE* the following .html files from the
    customer/**views** directory:

    - supplier-add.html

    - supplier-form-fields.html

    - supplier-update.html

![Image 64]({{ site.baseurl }}/assets/img/posts/image64.jpeg)
>
before
>
![Image 65]({{ site.baseurl }}/assets/img/posts/image65.png)
>
After.

7.  Edit the customer/**index.js** file as needed to account for the
    fact that the node application will now run on Docker containers:

    - Comment out lines 27 to 37 (ensure that each line starts with //).

    - On line 45, change the port number to 8080 Recall that when this
      application ran on the instance, it ran on port 80. However, when
      it runs as a Docker container, you will want the container to run
      on port 8080.

After all changes index.js will look like this:

![Image 66]({{ site.baseurl }}/assets/img/posts/image66.jpeg)

final content of

# Task 4.3: Create the customer microservice Dockerfile and launch a test container

The following diagram provides an overview of how we will use
[[Docker]{.underline}](https://aws.amazon.com/docker/). Assets that we
will use or create are represented by rectangles. Commands that we
will use are shown in blue between and above the rectangles.
>
![Image 67]({{ site.baseurl }}/assets/img/posts/image67.jpeg)
>
With the application code base and a Dockerfile, which we will create,
we will build a *Docker image*. A Docker image is a template with
instructions to create and run a Docker *container*. You can think of
a Docker *image* as roughly equivalent to an Amazon Machine Image
(AMI) from which we can launch an EC2 instance. A Docker *container*
is roughly equivalent to an EC2 instance. However, Docker images and
containers are much smaller.

1.  In the directory, create a new file named Dockerfile that contains
    the following code:

FROM node:11-alpineRUN -p /usr/src/appWORKDIR /usr/src/appCOPY . .RUN
npm installEXPOSE 8080CMD \[, , \]
>
**Analysis:** This Dockerfile code specifies that an Alpine Linux
distribution with Node.js runtime requirements should be used to
create a Docker image. The code also specifies that the container
should allow network traffic on TCP port 8080 and that the application
should be run and started when a container that was created from the
image is launched.
>
To do this task create Dockerfile in customer directory created file:
microservices/customer/Dockerfile
>
and the paste the code given above. It should be like this:
>
![Image 69]({{ site.baseurl }}/assets/img/posts/image69.jpeg)

2.  Build an image from the customer Dockerfile.

    - In the AWS Cloud9 terminal, change to the directory.

    - Run the following command:

    - docker build --- tag customer .

**Note:** In the output, ignore the npm warning about no repository
field.
>
Notice that the build downloaded the node Alpine starter image and
then completed the other instructions as specified in the Dockerfile.
>
In Cloud9 terminal:
>
\~/environment/microservices/customerdocker build - tag customer .
>
![Image 70]({{ site.baseurl }}/assets/img/posts/image70.jpeg)
>
cloud9 terminal after docker build.

3.  Verify that the customer-labeled Docker image was created.

    - Run a Docker command to list the Docker images that your Docker client is aware of. The output should be similar to the following:

    | REPOSITORY | TAG | IMAGE ID | CREATED | SIZE |
    |---|---|---|---|---|
    | customer | latest | cdc593c9bf51 | 59 seconds ago | 82.7MB |
    | node | 11-alpine | f18da2f58c3d | 3 years ago | 75.5MB |

**Note:** The *node* image is the Alpine Linux image that you identified in the Dockerfile contents to download and use as the starter image. Your Docker client downloaded it from docker.io. The *customer* image is the one that you created.
>
Command:
```bash
docker images
```

![Image 71]({{ site.baseurl }}/assets/img/posts/image71.jpeg)

verifies the image.

4.  Launch a Docker *container* that runs the *customer* microservice on
    port 8080. As part of the command, pass an environment variable to
    tell the node application the correct location of the database.

To set a dbEndpoint variable in your terminal session, run the
following commands:
>
dbEndpoint=\$(
\~/environment/microservices/customer/app/config/config.js \| grep \|
-d
>
-f2)

- You could manually find the database endpoint in the Amazon RDS
  console and set it as an environment variable by running
  dbEndpoint="\<actual-db-endpoint\>" instead of using the cat command.

- If you close your AWS Cloud9 terminal or stop and restart the project
  lab environment, and then need to run a command that uses the
  \$dbEndpoint variable, you might need to create the variable again. To
  test whether the variable is set, run echo \$dbEndpoint

- The following code provides an example of the command you should run
  that launches a container from the image:

docker run -d - name customer_1 -p 8080:8080 -e APP_DB_HOST= customer
>
This command launched a container named by using the image that you
created as the template. The -d parameter in the command specified
that it should run in the background. After the -p parameter, the
specified the port on the AWS Cloud9 instance to publish the container
to. The indicated the port that the container is running on in the
(also port 8080). The -e parameter passes the database host location
as an environment variable to Docker, which gives the node application
the information that it needs to establish network connectivity to the
database.
>
Running the above commands:

![Image 73]({{ site.baseurl }}/assets/img/posts/image73.jpeg)

5.  Check which Docker containers are currently running on the AWS
    Cloud9 instance.

![Image 74]({{ site.baseurl }}/assets/img/posts/image74.jpeg)

customer image is running.

6.  Verify that the *customer* microservice is running in the container
    and working as intended. create a new tab and run:
    http://\<cloud-9-public-IPv4-address\>:8080

![Image 75]({{ site.baseurl }}/assets/img/posts/image75.jpeg)
>
copy this ip.

![Image 76]({{ site.baseurl }}/assets/img/posts/image76.jpeg)

Webpage loaded.
>
Choose .

![Image 77]({{ site.baseurl }}/assets/img/posts/image77.jpeg)

Suppliers page.
>
Confirm that the supplier entries that you added earlier are
displayed. lets try to open administrator page:
>
![Image 78]({{ site.baseurl }}/assets/img/posts/image78.jpeg)
>
Administrator link works but doesnt open.
>
we have verified:
>
âœ” Page loads
>
âœ” "List of suppliers" works
>
âœ” No edit or add buttons
>
âœ” Administrator link shows (but won't work yet)

7.  Commit and push your source code changes into CodeCommit.

From cloud9 terminal run:
>
\~/environment/microservicesgit add customergit commit -m git push

![Image 79]({{ site.baseurl }}/assets/img/posts/image79.jpeg)

8.  Optional: Observe the commit details in the CodeCommit console.

Go to CodeCommit and select your repository then select commit.
>
![Image 80]({{ site.baseurl }}/assets/img/posts/image80.jpeg)
>
changes detail are visible here.

# Task 4.4: Modify the source code of the employee microservice

In this task, we will modify the source code for the *employee*
microservice similarly to how we modified the code for the customer
microservice. Customers (cafÃ© franchise location managers) should have
read-only access to the application data, but employees of the cafÃ©
corporate office should be able to add new entries or modify existing
entries in the list of coffee suppliers.
>
As we will see later in this project, we will deploy the microservices
behind an Application Load Balancer and route traffic to the
microservices based on the path that is contained in the URL of the
request. In this way, if the URL path includes /admin/, the load
balancer will route the traffic to the *employee* microservice.
Otherwise, if the URL path doesn\'t include /admin/, then the load
balancer will route the traffic to the *customer* microservice.
>
Because of the need to route traffic, much of the work in this task is
to configure the employee microservice to add /admin/ to the path of
the pages that it serves.

1.  In the AWS Cloud9 IDE, return to the file view (toggletree view).

![Image 81]({{ site.baseurl }}/assets/img/posts/image81.png)

2.  *Collapse* the **customer** directory, and then *expand* the
    **employee** directory.

![Image 82]({{ site.baseurl }}/assets/img/posts/image82.png)

3.  In the employee/app/controller/**supplier.controller.js** file, for
    all the redirect calls, prepend

/admin to the path.
>
\~/environment/microservices/employeegrep -n
app/controller/supplier.controller.js

![Image 83]({{ site.baseurl }}/assets/img/posts/image83.jpeg)

3 redirects found.
>
Update each redirect: Line 25 Change to: res.redirect();
>
Line 86 Change to:
>
res.redirect();
>
Line 103 Change to:
>
res.redirect();
>
Example:
>
Line 103 was:

![Image 84]({{ site.baseurl }}/assets/img/posts/image84.jpeg)

after updating line 103 becomes:

![Image 85]({{ site.baseurl }}/assets/img/posts/image85.jpeg)

4.  In the employee/**index.js** file, update the *app.get* calls,
    *app.post* calls, and a port number.

For all app.get and app.post calls, prepend /admin to the first
parameter.
>
run:
>
-n index.js

![Image 86]({{ site.baseurl }}/assets/img/posts/image86.jpeg)

we need to update line 22, 25, 27, 31, 33, 35, 37 open index.js:
>
![Image 87]({{ site.baseurl }}/assets/img/posts/image87.png)
>
line 22:
>
app.(, { res.(, {});})
>
line 25:
>
app.(, supplier.findAll);
>
line 27:
>
app.(, { res.(, {});});
>
line 31:
>
app.post(, supplier.);
>
line 33:
>
app.(, supplier.findOne);
>
line 35:
>
app.post(, supplier.update);
>
line 37:
>
app.post(, supplier.);
>
Port Change:
>
app_port = process.env.APP_PORT \|\|
>
to
>
app_port = process.env.APP_PORT \|\|

![Image 88]({{ site.baseurl }}/assets/img/posts/image88.jpeg)

index.js final content.

5.  In the employee/views/**supplier-add.html** and
    employee/views/**supplier-update.html** files, for the form action
    paths, prepend /admin to the path.

**Tip:** To find the three lines that need to be updated in the two
files, run the following command in the terminal:
>
-n views/\*

![Image 89]({{ site.baseurl }}/assets/img/posts/image89.jpeg)

Example change:
>
From:
>
=
>
To:
>
=
>
Updating line 11 in supplier-add.html:

![Image 90]({{ site.baseurl }}/assets/img/posts/image90.jpeg)

After update.
>
Updating line 12 and 38 in **supplier-update.html:**
>
![Image 91]({{ site.baseurl }}/assets/img/posts/image91.jpeg)
>
line 12 after update.

![Image 92]({{ site.baseurl }}/assets/img/posts/image92.jpeg)

line 38 after update.

6.  In the employee/views/**supplier-list-all.html** and
    employee/views/**home.html** files, for the HTML paths, prepend
    /admin to the path.

**Tip:** To find the three lines that need to be updated in the two
files, run the following command in the terminal:
>
grep -n views/supplier-list-all.html views/home.html
>
running in the above command in cloud9:

![Image 93]({{ site.baseurl }}/assets/img/posts/image93.jpeg)

output of grep command
>
In supplier-list-all.html:
>
Line 27 Change this:
>
=
>
To this:
>
=
>
Line 32 Change this:
>
=
>
To this:
>
=

![Image 94]({{ site.baseurl }}/assets/img/posts/image94.jpeg)

Updated supplier-list.html
>
In home.html:
>
Line 7 Change this:
>
List of suppliers
>
To this:
>
List of suppliers
>
![Image 95]({{ site.baseurl }}/assets/img/posts/image95.jpeg)
>
Updated home.html

7.  In the employee/views/**header.html** file, modify the title to be
    Manage coffee suppliers Edit header.html

Change title:
>
coffee suppliers

![Image 96]({{ site.baseurl }}/assets/img/posts/image96.jpeg)

header.html file.

8.  Edit the employee/views/**nav.html** file.

On line 3, change Monolithic Coffee suppliers to Manage coffee
suppliers
>
![Image 97]({{ site.baseurl }}/assets/img/posts/image97.jpeg)
>
On line 7, replace the existing line of code with the following:
>
Administrator home

![Image 98]({{ site.baseurl }}/assets/img/posts/image98.jpeg)

Add a new line *after* line 8 that contains the following HTML:
>
**Important:** *DON'T* delete or overwrite any of the existing lines
in the file.
>
Customer home

![Image 99]({{ site.baseurl }}/assets/img/posts/image99.jpeg)

Save changes.
>
I made a mistake earlier in line 12 in supplier-update.html:
>
corrected file is:

![Image 100]({{ site.baseurl }}/assets/img/posts/image100.jpeg)

line 12 should be \<form action="/admin/supplier-update"
method="POST"\>

# Task 4.5: Create the employee microservice Dockerfile and launch a test container

In this task, we will create a Docker image for the *employee*
microservice. Then, you will launch a test container from the image
and verify that the microservice works as expected.

1.  Create a Dockerfile for the microservice.

Duplicate the Dockerfile from the customer microservice into the
employee microservice area.
>
to copy use the following command:
>
cp \~croservices/customer/ \~croservices/employee/
>
Edit the employee/ to change the port number on the EXPOSE line to
8081
>
![Image 102]({{ site.baseurl }}/assets/img/posts/image102.jpeg)
>
line 6 changes to use 8081.

2.  Build the Docker image for the *employee* microservice. Specify
    employee as the tag.

\~/environment/microservices/employeedocker build \--tag employee .

![Image 103]({{ site.baseurl }}/assets/img/posts/image103.jpeg)

docker was build successfully.

3.  Run a container named employee_1 based on the employee image. Run it
    on port 8081 and be sure to pass in the database endpoint.

docker run -d employee_1 - : -e APP_DB_HOST= employee

![Image 104]({{ site.baseurl }}/assets/img/posts/image104.jpeg)

4.  Verify that the employee microservice is running in the container
    and that the microservice functions as intended.

    - Load the microservice web page in a new browser tab at
      http://\<cloud9-public-ip-address\>:8081/admin/suppliers

    - The application should load.

![Image 105]({{ site.baseurl }}/assets/img/posts/image105.jpeg)

Test adding a new supplier.

![Image 106]({{ site.baseurl }}/assets/img/posts/image106.jpeg)

![Image 107]({{ site.baseurl }}/assets/img/posts/image107.jpeg)
>
Test deleting an existing supplier:

![Image 108]({{ site.baseurl }}/assets/img/posts/image108.jpeg)

undertaker deleted
>
Test editing an existing supplier.

![Image 109]({{ site.baseurl }}/assets/img/posts/image109.jpeg)

changed the city to islamabad2.

5.  To observe details about both running test containers, run the
    following command:

docker ps

![Image 110]({{ site.baseurl }}/assets/img/posts/image110.jpeg)

# Task 4.6: Adjust the employee microservice port and rebuild the image

When we tested the employee microservice on the AWS Cloud9 instance,
we ran it on port 8081. However, when we deploy it to Amazon ECS, we
will want it to run on port 8080. To adjust this, you need to modify
two files.

1.  Edit the employee/ and employee/ files to change the port from 8081
    to 8080

In index.js:

![Image 111]({{ site.baseurl }}/assets/img/posts/image111.jpeg)

change line 45 to 8080.
>
in dockerfile:

![Image 112]({{ site.baseurl }}/assets/img/posts/image112.png)

change line 6 to 8080.

1.  Rebuild the Docker image for the employee microservice.

To stop and delete the existing container (assumes that the container
name is ), run the following command:

docker -f employee_1 \~/environment/microservices/employeedocker build
\--tag employee .

Ensure that your terminal is in the directory.
>
![Image 113]({{ site.baseurl }}/assets/img/posts/image113.jpeg)
>
Note: Make sure your customer docker is not running on 8080 if yes
run: docker rm -f customer_1

# Task 4.6: Adjust the employee microservice port and rebuild the image

From Cloud9 terminal:
>
\~/environment/microservicesgit add employeegit commit -m git push

![Image 114]({{ site.baseurl }}/assets/img/posts/image114.jpeg)

2.  Check your changes into CodeCommit.

![Image 115]({{ site.baseurl }}/assets/img/posts/image115.jpeg)

# Phase 5: Creating ECR repositories, an ECS cluster, task definitions,

# 

**and AppSpec files**
>
At this point, you have successfully implemented numerous solution
requirements. You split the monolithic application into two
microservices that can run as Docker containers. You have also
verified that the containers support the needed application actions,
such as adding, editing, and deleting entries from the database. The
microservices architecture still uses Amazon RDS to store the coffee
supplier entries.
>
However, your work isn't finished. There are more solution
requirements to implement. The containers are able to run on the AWS
Cloud9 instance, but that isn't a scalable deployment architecture.
You need the ability to scale the number of containers that run on
each microservice up and down depending on need. Also, you need to
have a load balancer to route traffic to the appropriate microservice.
Finally, you need to be able to easily update each application
microservice's codebase independently and roll those changes into
production. In the remaining phases of the project, you will work to
accomplish these solution requirements.

# Task 5.1: Create ECR repositories and upload the Docker images

In this phase, you will upload the latest Docker images of the two
microservices to separate Amazon ECR repositories.

1.  To authorize your Docker client to connect to the Amazon ECR
    service, run the following commands:

account_id=\$(aws sts get-caller-identity \|grep Account\| -d -f4) aws
ecr get-login-password \--region us-east-1 \| docker login \--username
AWS \--password-stdin .dkr.ecr.us-east-1.amazonaws.com
>
![Image 117]({{ site.baseurl }}/assets/img/posts/image117.jpeg)

![Image 118]({{ site.baseurl }}/assets/img/posts/image118.jpeg)

2.  Create a separate private ECR repository for each microservice.

    - Name the first repository customer

    - Name the second repository employee

AWS Console â†’ **ECR** â†’ **Repositories** â†’ **Create repository:**
>
![Image 119]({{ site.baseurl }}/assets/img/posts/image119.jpeg)
>
Create **two private repositories**:

1.  Repository name:

2.  Repository name: Leave defaults â†’ **Create**

![Image 120]({{ site.baseurl }}/assets/img/posts/image120.jpeg)
>
creating employee repository.
>
Similarly create customer repository.
>
![Image 121]({{ site.baseurl }}/assets/img/posts/image121.jpeg)

3.  Set permissions on the *customer* ECR repository.

For **each repository (customer + employee)**:
>
ECR â†’ Repository â†’ **Permissions** â†’ **Edit policy**

![Image 122]({{ site.baseurl }}/assets/img/posts/image122.jpeg)

click on permissions
>
click on edit json
>
Replace the existing lines in the policy with the following:

![Image 123]({{ site.baseurl }}/assets/img/posts/image123.jpeg)

Do this for both repositories.

5.  Tag the Docker images with your unique *registryId* (account ID)
    value to make it easier to manage and keep track of these images.

In the AWS Cloud9 IDE, run the following commands:
>
account_id=\$(aws sts get-caller-identity \|grep Account\| -d -f4)
docker tag customer:latest
.dkr.ecr.us-east-1.amazonaws.com/customer:latestdocker tag
employee:latest .dkr.ecr.us-east-1.amazonaws.com/employee:latest
>
**Note:** The commands don't return output.

![Image 124]({{ site.baseurl }}/assets/img/posts/image124.jpeg)

Run the appropriate docker command to verify that the images exist and
the tags were applied.
>
run:
>
docker images
>
You should now see **4 images**:

- customer

- employee

- accountID/customer

- accountID/employee

![Image 126]({{ site.baseurl }}/assets/img/posts/image126.jpeg)

if u see none just ignore it.

6.  Run the appropriate docker command to push each of the Docker images
    to Amazon ECR.

docker push .dkr.ecr.us-east-1.amazonaws.com/customer:latestdocker
push .dkr.ecr.us-east-1.amazonaws.com/employee:latest
>
![Image 127]({{ site.baseurl }}/assets/img/posts/image127.jpeg)

7.  Confirm that the two images are now stored in Amazon ECR and that
    each has the *latest*

label applied.
>
Verify in **ECR console** â†’ both images show **latest.**

![Image 128]({{ site.baseurl }}/assets/img/posts/image128.jpeg)

customer ecr

![Image 129]({{ site.baseurl }}/assets/img/posts/image129.jpeg)

employee ecr

# Task 5.2: Create an ECS cluster

In this task, you will create an Amazon ECS cluster.
>
1\. Create a serverless AWS Fargate cluster that is named
microservices-serverlesscluster
>
Ensure that it's configured to use *LabVPC*, *PublicSubnet1*, and
*PublicSubnet2* (remove any other subnets). *DON'T* select Amazon EC2
instances or ECS Anywhere.

AWS Console â†’ **ECS** â†’ **Clusters** â†’ **Create cluster**

![Image 130]({{ site.baseurl }}/assets/img/posts/image130.jpeg)
>
click on create cluster.
>
Choose:
>
![Image 131]({{ site.baseurl }}/assets/img/posts/image131.png) Cluster name:

![Image 132]({{ site.baseurl }}/assets/img/posts/image132.jpeg)

Configure as above and click on create

![Image 133]({{ site.baseurl }}/assets/img/posts/image133.jpeg)

**Important:** After choosing the button to create the cluster, in the
banner that appears across the top of the page, choose **View in
CloudFormation**. Wait until the stack that creates the cluster
attains the status *CREATE_COMPLETE* before you proceed to the next
task. *If the stack fails to create for any reason and therefore rolls
back*, repeat these steps to try again. It should succeed the second
time.
>
After creation:

- Click

- Wait until stack status =

# Task 5.3: Create a CodeCommit repository to store deployment files

In this task, you will create another CodeCommit repository. This
repository will store the task configuration specification files that
Amazon ECS will use for each microservice. The repository will also
store AppSpec specification files that CodeDeploy will use for each
microservice.

1.  Create a new CodeCommit repository that is named deployment to store
    deployment configuration files.

AWS Console â†’ **CodeCommit** â†’ **Create repository**
>
Name: **deployment**

![Image 136]({{ site.baseurl }}/assets/img/posts/image136.jpeg)

![Image 137]({{ site.baseurl }}/assets/img/posts/image137.jpeg)

2.  In AWS Cloud9, in the **environment** directory, create a new
    directory that is named

deployment. Initialize the directory as a Git repository with a branch
named dev. in cloud9 run the following:
>
\~/environment deployment deploymentgit initgit branch -m dev
>
![Image 138]({{ site.baseurl }}/assets/img/posts/image138.jpeg)

# Task 5.4: Create task definition files for each microservice and register them with Amazon ECS

In this task, you will create a task definition file for each
microservice and then register the task definitions with Amazon ECS.

1.  In the new directory, create an empty file named
    taskdef-customer.json

\~/environment/deploymentnano taskdef-customer.json
>
Replace:

- \<ACCOUNT-ID\>

- \<RDS-ENDPOINT\>

Save.
>
Join Medium for free to get updates from this writer.
>
account id can be copied from here:

![Image 139]({{ site.baseurl }}/assets/img/posts/image139.jpeg)

RDS-endpoint can be copied from here:

![Image 140]({{ site.baseurl }}/assets/img/posts/image140.jpeg)

![Image 141]({{ site.baseurl }}/assets/img/posts/image141.jpeg)
>
Save.

3.  To register the *customer* microservice task definition in Amazon
    ECS, run the following command:

aws ecs -task-definition - cli-input-json
>
After running the command we will get this output:
>
![Image 142]({{ site.baseurl }}/assets/img/posts/image142.jpeg)

4.  In the Amazon ECS console, verify that the *customer-microservice*
    task definition now appears in the **Task definitions** pane. Also,
    notice that the revision number displays after the task definition
    name.

Verify in ECS â†’ **Task definitions**
>
![Image 143]({{ site.baseurl }}/assets/img/posts/image143.jpeg)
>
verified.

![Image 144]({{ site.baseurl }}/assets/img/posts/image144.jpeg)

5.  In the *deployment* directory, create a taskdef-employee.json
    specification file.

Add the same JSON code to it that currently exists in the file (where
you have already set the account ID and RDS endpoints).
>
run:
>
taskdef-customer.json taskdef-employee.jsonnano taskdef-employee.json

After you paste in the code, change the three occurrences of customer to
employee

Change **customer â†’ employee** (3 places):

- name

- image

- family

![Image 146]({{ site.baseurl }}/assets/img/posts/image146.jpeg)
>
final content of taskdef-employee.json.
>
7\. To register the *employee* task definition with Amazon ECS, run an
AWS CLI command.
>
aws ecs register-task-definition \\\--cli-input-json /-employee.json
>
![Image 147]({{ site.baseurl }}/assets/img/posts/image147.jpeg)
>
regsitered.
>
7\. In the Amazon ECS console, verify that the *employee-microservice*
task definition now appears in the **Task definitions** pane. Also,
notice that the revision number displays after the task definition
name.

![Image 148]({{ site.baseurl }}/assets/img/posts/image148.jpeg)

# Task 5.5: Create AppSpec files for CodeDeploy for each microservice

In this task, you will continue to complete tasks to support deploying
the microservices-based web application to run on an ECS cluster where
the deployment is supported by a CI/CD pipeline. In this specific
task, you will create two [[application specification]{.underline}
([A]{.underline}pp[Spec]{.underline})
[files]{.underline}](https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html),
one
>
for each microservice. These files will provide instructions for
CodeDeploy to deploy the microservices to the Amazon ECS on Fargate
infrastructure.

1.  Create an AppSpec file for the microservice.

In the directory, create a new file named appspec-customer.yaml
>
run the following in cloud9 terminal:
>
Paste the following YAML code into the file:

![Image 149]({{ site.baseurl }}/assets/img/posts/image149.jpeg)

Save the changes.

2.  In the same directory, create an AppSpec file for the *employee*
    microservice.

Name the file appspec-employee.yaml. run the following:
>
appspec-customer.yaml appspec-employee.yamlnano appspec-employee.yaml
>
The contents of the file should be the same as the file. However,
change customer\`\` on thecontainerNameline to beemployee\`
>
![Image 150]({{ site.baseurl }}/assets/img/posts/image150.jpeg)

# Task 5.6: Update files and check them into CodeCommit

In this task, you will update the two task definition files. Then, you
will push the four files that you created in the last two tasks into
the *deployment* repository.

1.  Edit the file.

Modify line 5 to match the following line:
>
to do this run the following:
>
nano taskdef-customer.json
>
![Image 151]({{ site.baseurl }}/assets/img/posts/image151.jpeg)
>
"image": "\<IMAGE1_NAME\>", is added
>
Save the change.
>
**Analysis:** \<IMAGE1_NAME\> is not a valid image name, which is why
you originally set the image name to *customer* before running the AWS
CLI command to register the first revision of the file with Amazon
ECS. However, at this point in the project, it\'s important to set the
image value to a placeholder text value. Later in this project, when
you configure a pipeline, you will identify IMAGE1_NAME as placeholder
text that can be dynamically updated. In summary, CodePipeline will
set the correct image name dynamically at runtime.

2.  Edit the **taskdef-employee.json** file. to do this run the
    following:

nano taskdef-employee.json
>
Change:
>
![Image 152]({{ site.baseurl }}/assets/img/posts/image152.jpeg)
>
Save.

3.  Push all four files to CodeCommit for this run the following:

git add .git commit -m git remote add origin
[https://git-codecommit.us-east-](https://git-codecommit.us-east/)1.amazonaws.com/v1/repos/deploymentgit
push -u origin dev
>
![Image 153]({{ site.baseurl }}/assets/img/posts/image153.jpeg)

# Phase 6: Creating target groups and an Application Load Balancer

In this phase, you will create an Application Load Balancer, which
provides an endpoint URL. This URL will act as the HTTPS entry point
for customers and employees to access your application through a web
browser. The load balancer will have listeners, which will have
routing and access rules that determine which target group of running
containers the user request should be directed to.

# Task 6.1: Create four target groups

In this task, you will create four target groups --- two for each
microservice. Because you will configure a blue/green deployment,
CodeDeploy requires two target groups for each deployment group.
>
**Note:** Blue/green is a deployment strategy where you create two
separate but identical environments. One environment (blue) runs the
current application version, and one environment (green) runs the new
application version.

1.  Create the first target group for the microservice.

AWS Console â†’ **EC2** â†’ **Target Groups** â†’ **Create target group**

![Image 155]({{ site.baseurl }}/assets/img/posts/image155.jpeg)

target group opened.
>
![Image 156]({{ site.baseurl }}/assets/img/posts/image156.jpeg)
>
Configure as above.
>
Set:

- Target type:

- Target group name:

- Protocol:

- Port:

- VPC:

- Health check path: /

Choose **Next**

## Do NOT register targets

C**reate target group**

![Image 158]({{ site.baseurl }}/assets/img/posts/image158.jpeg)

target group successfully created.

2.  Create a second target group for the *customer* microservice. Use
    the same settings as the first target group except use
    customer-tg-two as the target group name.

![Image 159]({{ site.baseurl }}/assets/img/posts/image159.jpeg)

second target group
>
Create another target group with **same settings**, except: Target
group name:
>
Everything else **identical**:

- Port

- Health check /

Create it.
>
![Image 161]({{ site.baseurl }}/assets/img/posts/image161.jpeg)

3.  Create a target group for the *employee* microservice. Use the same
    settings as the other target groups with the following exceptions:

    - Enter employee-tg-one

    - Enter /admin/suppliers

![Image 162]({{ site.baseurl }}/assets/img/posts/image162.jpeg)

Third target group

- Target type:

- Target group name:

- Protocol:

- Port:

- VPC:

/admin/suppliers
>
Create it.

![Image 163]({{ site.baseurl }}/assets/img/posts/image163.jpeg)

Created.
>
Create a second target group for the *employee* microservice. Use the
same settings as the other target groups with the following
exceptions:

- Enter employee-tg-two

- Enter /admin/suppliers

![Image 164]({{ site.baseurl }}/assets/img/posts/image164.jpeg)
>
After creating all above target groups: We now have these 4.

![Image 165]({{ site.baseurl }}/assets/img/posts/image165.jpeg)

4 target groups.

# Task 6.2: Create a security group and an Application Load Balancer, and configure rules to route traffic

In this task, you will create an Application Load Balancer. You will
also define two listeners for the load balancer: one on port 80 and
another on port 8080. For each listener, you will then define
path-based routing rules so that traffic is routed to the correct
target group depending on the URL that a user attempts to load.

1.  Create a new EC2 security group named microservices-sg to use in .
    Add inbound rules that allow TCP traffic from any IPv4 address on
    ports 80 and 8080.

EC2 â†’ **Security Groups** â†’ **Create security group**

- Name:

- VPC:

![Image 167]({{ site.baseurl }}/assets/img/posts/image167.jpeg)

here we added the name and inbound rules.
>
Create security group.
>
![Image 168]({{ site.baseurl }}/assets/img/posts/image168.jpeg)

2.  In the Amazon EC2 console, create an Application Load Balancer named
    microservicesLB.

    - Make it internet facing for IPv4 addresses.

    - Use , , , and the security group.

    - Configure two listeners on it. The first should listen on and
      forward traffic to by default. The second should listen on and
      forward traffic to by default.

EC2 â†’ **Load Balancers** â†’ **Create load balancer**
>
Choose **Application Load Balancer**
>
Configure:

- Name:

- Scheme:

- IP address type:

## Network mapping

- VPC:

- Subnets:

- PublicSubnet1

- PublicSubnet2

- Remove any others

## Security group

Select
>
![]({{ site.baseurl }}/assets/img/posts/image169.png)Basic configuration
>
ï¿½llï¿½.dli:tf\'ll.111111\'

\...\...\...\....

ArTa:alftlmail.SZalJn\'lnanâ€¢tcchllâ€¢.::t.-on1lâ– :ln;;ii..,.t.,.â€¢Â·â€¢\_.lic-d,tN.r.U.ru-1TU11tna.bftl.,D\<â€¢nf-thâ€¢hJl::lwn..
>
ï¿½â€¢un\"lib.-cï¿½dJ1hotlhol.cudb.ollll\'ICll\"\<ICl.-..:i
>
l..6ad l:l./1;;111:nâ€¢ IP\' .idi!Uil C)IIJi\'.! lnfa
>
ï¿½l111tth1ln:nt.-11n:IPâ€¢llclra1tof111tz:111â– 11:1r,lzl,t.l111dbil,.\'ICll\",l.\_,,.r,:,\_.n:1.,1nirt1.-p111dl111halca::INlilnm1mlllf.nclâ– :11-:tâ– 11\\utâ– :11P1111dâ€¢aalÂ¥Pa,.rmu1Psol,1dmaafthl.\\w1nâ– :kl.t1cnaa11\'1.
>
0\"\'\"\'
>
Tndua.a,ti\'ll\'Y4.1d!lraau.
>
Q1Jt.1;1L5Cï¿½
>
Q1Ju;1ts.Cï¿½i,i,{flli:Olpubtlclfl1M.
>
Tndua..1p,1.1l:IIE-â€¢lld1â– -,â€¢ro::lp,nnalr.4Nld-.-tdt-.Cmnpalblll-th-.Oft-\'ftl:ln1l-llaM\>al1\"111Pllir,.
>
![]({{ site.baseurl }}/assets/img/posts/image170.png)![]({{ site.baseurl }}/assets/img/posts/image171.jpeg)a.f:rlK.:t-04:l\'rl
:5b4Yliil\"i111Ilt 1P1\<11mrar CJIIH: 111.n.11110/VI

![Image 172]({{ site.baseurl }}/assets/img/posts/image172.png)

\"U\"nt\"i\' \"CIC\'JIR llilli:b Ellll\'oi:i,G\'l:inqta \'Itâ–  La.I
i.-uPJ1ddta11t\'J\"lll-uâ€¢d.ï¿½ 1nmâ–  a-llbl.â–  Ir IDD:al\'II â€¢â€¢
-.q1,11111d far Jt:1,11 lllid Nlilnla\' ï¿½alUllâ– rilaur.ti,.
>
:a.t!nt::t-()61591\"9661k:6bl:)291 IP1\<11ï¿½CJIIH:lll.it.m.(I/VI
>
l\',libllc.Subllilltl
>
l\\libllc.Subrwit..l:
>
Security groups.1nfu
>
.llsÂ«i1..1rfl,;grauplsillï¿½tflll\'i\"l:v.i111lnJl1Xll\'WJ\<11ntl\'lll.tlK:ttil!Sll.:t11y,,t1kia.dbal..l111:Qf\".\'Sc:!Qct\_\...ï¿½g,ï¿½rilJil-JrdUP.()r!l\'\[IUGl\'lt:l\"Git,;,.1nQIJoï¿½rygrnup.l!I.
>
![Image 173]({{ site.baseurl }}/assets/img/posts/image173.png)

:::Â·======

============\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\-\--ï¿½\" \] @
>
Listeners.and r,outing w.-
>
.111.11:.rralWf\" Iï¿½.I ï¿½11\\illtci\'Wdts l\'lll\'\<Dnn.adlon
ll\'llll:IUDSt:; ï¿½ â€¢hill JrEil\'it.llldjlKrla.:d y1:1u *\<Dï¿½.*Ihrl:
n.AIS: il\'lolt ï¿½u dcdlnll far.a, Uï¿½titniar
dc:Wnr.iiM:hol,l,l,i1tw-lki.iidï¿½no:.a, ruurra:s: RQJl2S,
COï¿½NglstffC:i:!Qrgittt.
>
![Image 176]({{ site.baseurl }}/assets/img/posts/image176.png)i. l.ktmKf\" HTTP:BD
>
![Image 177]({{ site.baseurl }}/assets/img/posts/image177.png)\'Y Uaul\'lo3\'\" HJTP:11118\[\]
>
flrctacol Pott
>
HiTTP 8060
>
Default ï¿½ï¿½on ..\_
>
rt. dirfallL.. Ehcn,. \....,..1111111:hM\' \... 1. â€¢PILI\' Ch:Hllâ€¢IIH
ddllllltt.nhcn hr 1r.. rh. an ltw. Ull\'TIIII,
>
![]({{ site.baseurl }}/assets/img/posts/image178.png)I-O-rar-w,m-:::li-o!t.1-f!!a-Cï¿½-up,-.;;
\-\-\-\-\-\-\-\-\--ï¿½I\[ O RDdlflilab:r
>
ren..ird ta;t\_ï¿½ff 9N:rup ï¿½
>
![Image 179]({{ site.baseurl }}/assets/img/posts/image179.jpeg)ci-.â– t1r:;irfl11rau11mr:1-.if\'fraâ– 111nq-111\'11:111C1Utâ– taC1111i:iraÂ°\"
ï¿½-
>
Ycuï¿½â€¢llclupb:l-1-,â€¢ tm\'t!\<llï¿½ia-
>
T.arl\'.liH \'9ffrUP, ï¿½tl.:l:inBI ll\'ffll
>
l1111:1tnvâ– i\...11aaKâ€¢r111b-nd1.â€¢l\"l\"11-anta-â€¢qaaflâ€¢â€¢.1ï¿½11\"\"11ï¿½Tlluâ€¢11HUW.thtlï¿½n:mâ€¢tâ– .111PGn.ccai-lllra.i.\_-it.111bnr:1â– 1Aa\"1lH1&1mta.11111cJo,\\aqd,tana,-:tâ– Tâ€¢=-Cora.ip.1hn:Hlla\'ï¿½rl.l-..
>
Tall on t.r9\'1i.gTa,4:1 WdflnQ21;
>
l..i\'.ttll!Cf\'ï¿½-ï¿½
>
CJ::r\....:M1\'1ddnq lÂ»qâ– tzl\'l\"\"IS\"labl,\....
Tqâ– ,,,.,\...,\....11:1mlï¿½ï¿½r.,\....,A\'ll\':J.â€¢ncurra.,,\...\_.c..-\>-
\_,â€¢-â€¢â€¢.\--ruq,,,l:han
>
( Addll,..,nu\"\'9)
>
Ya., ï¿½â€¢dduplzl.5\[1merâ–  ba:p.

![Image 180]({{ site.baseurl }}/assets/img/posts/image180.png)

configure as above.
>
Create the load balancer.
>
Wait until **Load Balancer status = Active**

![Image 181]({{ site.baseurl }}/assets/img/posts/image181.jpeg)

3.  Add a second rule for the *HTTP:80* listener. Define the following
    logic for this new rule: EC2 â†’ Load Balancers â†’ **microservicesLB**

Go to **Listeners** â†’ **HTTP : 80** â†’ **View/edit rules**
>
Add rule:

## IF

Path = /admin/\*

## THEN

Forward to â†’ **employee-tg-two**
>
Priority: leave auto-assigned

![Image 182]({{ site.baseurl }}/assets/img/posts/image182.jpeg)

![Image 183]({{ site.baseurl }}/assets/img/posts/image183.jpeg)

![Image 184]({{ site.baseurl }}/assets/img/posts/image184.jpeg)

priority should be 1 not -
>
save

![Image 185]({{ site.baseurl }}/assets/img/posts/image185.jpeg)

Add a second rule for the *HTTP:8080* listener. Define the following
logic for this new rule:

- IF is /admin/\*

- THEN the target group.

Select **HTTP : 8080** listener â†’ **View/edit rules**
>
![Image 187]({{ site.baseurl }}/assets/img/posts/image187.jpeg)
>
click next
>
![Image 188]({{ site.baseurl }}/assets/img/posts/image188.jpeg)
>
click next and add rule.

![Image 189]({{ site.baseurl }}/assets/img/posts/image189.jpeg)

This marks completion of phase 6.

# Phase 7: Creating two Amazon ECS services

In this phase, you will create a service in Amazon ECS for each
microservice. Although you could deploy both microservices to a single
ECS service, for this project, it will be easier to manage the
microservices independently if each is deployed to its own ECS
service.

# Task 7.1: Create the ECS service for the customer microservice

1.  In AWS Cloud9, create a new file named
    create-customer-microservice-tg-two.json

in the directory.
>
\~/environment/deploymentnano create-customer-microservice-tg-two.json

2.  Paste the following JSON code into the file:

![Image 190]({{ site.baseurl }}/assets/img/posts/image190.jpeg)
>
ctrl + s and then ctrl +x.

3.  Edit the **create-customer-microservice-tg-two.json** file:

Replace with the number of the latest revision of the task definition
that is registered with Amazon ECS
>
change to this: "taskDefinition": "customer-microservice:1"
>
![Image 191]({{ site.baseurl }}/assets/img/posts/image191.jpeg)
>
Replace with the actual ARN of the target group. EC2 â†’ **Target
Groups** â†’ customer-tg-two â†’ **ARN**
>
![Image 192]({{ site.baseurl }}/assets/img/posts/image192.jpeg)
>
copy this
>
Replace:

![Image 193]({{ site.baseurl }}/assets/img/posts/image193.jpeg)

paste it like this.

- Replace with the actual subnet ID of .

- Replace with the actual subnet ID of .

VPC â†’ **Subnets**
>
PublicSubnet1 â†’ copy **Subnet ID**
>
PublicSubnet2 â†’ copy **Subnet ID**
>
![Image 195]({{ site.baseurl }}/assets/img/posts/image195.jpeg)
>
copy id of subnet

![Image 196]({{ site.baseurl }}/assets/img/posts/image196.png)

copy id for public subnet 2
>
Paste it like this:
>
![Image 197]({{ site.baseurl }}/assets/img/posts/image197.png)
>
Paste it in the code.

Replace with the actual security group ID of .

EC2 â†’ **Security Groups** â†’ microservices-sg

![Image 198]({{ site.baseurl }}/assets/img/posts/image198.jpeg)

copy id

![Image 199]({{ site.baseurl }}/assets/img/posts/image199.jpeg)

paste it here
>
Save the changes
>
![Image 200]({{ site.baseurl }}/assets/img/posts/image200.jpeg)
>
final code
>
press ctrl + S and then ctrl+X

4.  To create the Amazon ECS service for the *customer* microservice,
    run the following commands:

\~/environment/deploymentaws ecs create-service \--service-name
customer-microservice \--cli-input-json
file://create-customer-microservice-tg-two.json
>
you will recieve output like this:
>
![Image 201]({{ site.baseurl }}/assets/img/posts/image201.jpeg)

# Task 7.2: Create the Amazon ECS service for the employee micros

1.  Create an Amazon ECS service for the microservice.

Copy the JSON file that you created for the microservice, and name it
create-employee-microservice-tg-two.json. Save it in the same
directory.
>
cp -customer-microservice-tg-two.json
-employee-microservice-tg-two.json
>
Modify the file:
>
nano -employee-microservice-tg-two.json
>
![Image 202]({{ site.baseurl }}/assets/img/posts/image202.jpeg)
>
On line 2, change customer-microservice to employee-microservice and
also update the .

![Image 203]({{ site.baseurl }}/assets/img/posts/image203.jpeg)

On line 6, enter the ARN of the target group.
>
Replace **entire ARN** with: ARN of
>
![Image 204]({{ site.baseurl }}/assets/img/posts/image204.jpeg)
>
copy this arn

![Image 205]({{ site.baseurl }}/assets/img/posts/image205.jpeg)

paste it like this
>
**Tip:** Don't just change customer to employee on this line. The ARN
is unique in other ways.
>
On line 7, change customer to employee

![Image 206]({{ site.baseurl }}/assets/img/posts/image206.jpeg)

Save the changes. ctrl + S and then ctrl + X Final code:
>
![Image 207]({{ site.baseurl }}/assets/img/posts/image207.jpeg)

2.  Run the appropriate AWS CLI command to create the service in Amazon
    ECS.

aws ecs create-service employee-microservice
file://create-employee-microservice-tg-two.json
>
we will get output like this:
>
![Image 208]({{ site.baseurl }}/assets/img/posts/image208.jpeg)

# Verify in ECS console

ECS â†’ **Clusters** â†’ microservices-serverlesscluster â†’ **Services**
>
You should see:

- customer-microservice

- employee-microservice

Each likely shows: 0/1 tasks running

## âœ… This is EXPECTED

(Tasks are deployed in Phase 8 via CodeDeploy)
>
![Image 210]({{ site.baseurl }}/assets/img/posts/image210.jpeg)

# Phase 8: Configuring CodeDeploy and CodePipeline

Now that you have defined the Application Load Balancer, target
groups, and the Amazon ECS services that comprise the infrastructure
that you will deploy your microservices to, the next step is to define
the CI/CD pipeline to deploy the application.
>
The following diagram illustrates the role of the pipeline in the
solution that you are building.

![Image 211]({{ site.baseurl }}/assets/img/posts/image211.jpeg)

*Diagram description:* The pipeline will be invoked by updates to
CodeCommit, where you have stored the ECS task definition files and
the CodeDeploy AppSpec files. The pipeline can also be invoked by
updates to one of the Docker image files that you have stored in
Amazon ECR. When invoked, the pipeline will call the CodeDeploy
service to deploy the updates.
>
CodeDeploy will take the necessary actions to deploy the updates to
the green environment. Assuming that no errors occur, the new task set
will replace the existing task set.

# Task 8.1: Create a CodeDeploy application and deployment groups

A CodeDeploy application is a collection of deployment groups and
revisions. A deployment group specifies an Amazon ECS service, load
balancer, optional test listener, and two target groups. A group
specifies when to reroute traffic to the replacement task set, and
when to terminate the original task set and Amazon ECS application
after a successful deployment.

1.  Use the CodeDeploy console to create a CodeDeploy application with
    the name

microservices that uses Amazon ECS as the compute platform.
>
Console steps:
>
Open **AWS CodeDeploy** Choose **Applications** Click **Create
application** Fill in:

- microservices

- Amazon ECS

![Image 214]({{ site.baseurl }}/assets/img/posts/image214.jpeg)

Click **Create application**
>
![Image 215]({{ site.baseurl }}/assets/img/posts/image215.jpeg)

2.  Create a CodeDeploy deployment group for the *customer*
    microservice.

    - On the application detail page, choose the tab.

    - Choose and configure the following:

    - Enter microservices-customer

    - Place your cursor in the search box, and choose the ARN for .

    - In the section:

    - Choose .

    - Choose .

    - In the section:

    - Choose .

    - Choose .

    - Choose .

    - Choose .

    - Choose .

    - In the section:

    - Choose .

    - Choose .

    - Days: , Hours: , Minutes:

    - Choose .

![Image 216]({{ site.baseurl }}/assets/img/posts/image216.jpeg)
>
![Image 217]({{ site.baseurl }}/assets/img/posts/image217.jpeg)
>
![Image 218]({{ site.baseurl }}/assets/img/posts/image218.jpeg)
>
click on create deployment.

![Image 219]({{ site.baseurl }}/assets/img/posts/image219.jpeg)

3.  Create a CodeDeploy deployment group for the *employee*
    microservice. Specify the same settings that you did in the prior
    step, except for the following:

    - Enter microservices-employee

    - Choose .

    - Choose .

    - Choose .

![Image 220]({{ site.baseurl }}/assets/img/posts/image220.jpeg)

![Image 221]({{ site.baseurl }}/assets/img/posts/image221.jpeg)
>
click on create deployment.

# Task 8.2: Create a pipeline for the customer microservice

In this task, you will create a pipeline to update the *customer*
microservice. When you first define the pipeline, you will configure
CodeCommit as the source and CodeDeploy as the service that is
responsible for deployment. You will then edit the pipeline to add the
Amazon ECR service as a second source.
>
With an Amazon ECS blue/green deployment, which you will specify in
this task, you provision a new set of containers, which CodeDeploy
installs the latest version of your application on.
>
CodeDeploy then reroutes load balancer traffic from an existing set of
containers, which run the previous version of your application, to the
new set of containers, which run the latest version. After traffic is
rerouted to the new containers, the existing containers can be
terminated. With a blue/green deployment, you can test the new
application version before sending production traffic to it.

1.  In the CodePipeline console, create a pipeline with the following
    settings:

    - Enter update-customer-microservice

    - Choose the ARN for .

    - Choose .

    - Choose .

**Note:** You have defined two CodeCommit repositories. The
*deployment* repository contains the Amazon ECS task definition files
and CodeDeploy AppSpec files that your pipeline will need, so that is
the one you choose here.

- Choose .

- the build stage.

- US East (N. Virginia).

- microservices

- microservices-customer

- Under :

- Set a with a value of taskdef-customer.json

- Under :

- Set a with a value of appspec-customer.yaml

**Note:** Leave the *Dynamically update task definition image* fields
*blank* for now.
>
**Note:** After you create the pipeline, it will immediately start to
run and will eventually fail on the
>
*Deploy* stage. Ignore that for now and continue to the next step.
Steps:
>
Open **AWS CodePipeline â†’ Create pipeline**

![Image 223]({{ site.baseurl }}/assets/img/posts/image223.jpeg)

![Image 224]({{ site.baseurl }}/assets/img/posts/image224.jpeg)

# Pipeline settings

- update-customer-microservice

- PipelineRole

- Default

![Image 225]({{ site.baseurl }}/assets/img/posts/image225.jpeg)

![Image 226]({{ site.baseurl }}/assets/img/posts/image226.jpeg)
>
Skip build stage and deploy.
>
**Region:** us-east-1
>
![Image 227]({{ site.baseurl }}/assets/img/posts/image227.jpeg)
>
fill like this.
>
and then create.

![Image 228]({{ site.baseurl }}/assets/img/posts/image228.jpeg)

The pipeline will **FAIL** --- this is **EXPECTED**

2.  Edit the *update-customer-microservice* pipeline to add another
    *source*.

    - In the section, choose , then add an action with these details:

    - Image

    - Amazon ECR

    - customer

    - latest

    - image-customer

![Image 229]({{ site.baseurl }}/assets/img/posts/image229.jpeg)

edit source:

![Image 230]({{ site.baseurl }}/assets/img/posts/image230.jpeg)

fill it like this:
>
![Image 231]({{ site.baseurl }}/assets/img/posts/image231.jpeg)

3.  Edit the *deploy* action of the *update-customer-microservice*
    pipeline. edit this:

![Image 232]({{ site.baseurl }}/assets/img/posts/image232.jpeg)
>
Under Input artifacts:
>
Add â†’ image-customer
>
Dynamic image section:

- image-customer

- IMAGE1_NAME

![Image 234]({{ site.baseurl }}/assets/img/posts/image234.jpeg)
>
fill it like this.
>
Save â†’ Save pipeline

# Task 8.3: Test the CI/CD pipeline for the customer microservice

1.  Launch a deployment of the microservice on Amazon ECS on Fargate.

    - Navigate to the CodePipeline console.

    - On the page, choose the link for the pipeline that is named .

    - To force a test of the current pipeline settings, choose , and
      then choose .

![Image 236]({{ site.baseurl }}/assets/img/posts/image236.png)

here click on release change.

- By invoking the pipeline, you created a new revision of the task
  definition.

- Wait for the two tasks to show a status of .

![Image 237]({{ site.baseurl }}/assets/img/posts/image237.jpeg)
>
In the section, wait for a link to appear, and then click the link.
>
A CodeDeploy page opens in a new browser tab.

![Image 238]({{ site.baseurl }}/assets/img/posts/image238.jpeg)

2.  Observe the progress in CodeDeploy.

Scroll to the bottom of the page, and notice the **Deployment
lifecycle events** section. Test in browser:
>
Get ALB DNS:
>
EC2 â†’ Load Balancers â†’ microservicesLB

![Image 239]({{ site.baseurl }}/assets/img/posts/image239.jpeg)

All lifecycle steps should succeed

3.  Load the *customer* microservice in a browser tab and test it.

Locate the value of the load balancer, and paste it into a new browser
tab.

![Image 240]({{ site.baseurl }}/assets/img/posts/image240.jpeg)

copy this dns.
>
Try:
>
http:
>
If not working yet:
>
http:
>
![Image 241]({{ site.baseurl }}/assets/img/posts/image241.jpeg)
>
mine worked perfectly.
>
In the cafÃ© web application, choose or .

![Image 242]({{ site.baseurl }}/assets/img/posts/image242.jpeg)

No add/edit buttons

4.  Observe the running tasks in the Amazon ECS console.

    - Navigate to the Amazon ECS console.

    - In the clusters list, choose the link for .

On the **Services** tab, notice that the *customer-microservice*
service appears. The **Deployments and tasks** status will change as
the blue/green deployment advances through its lifecycle events.
>
![Image 243]({{ site.baseurl }}/assets/img/posts/image243.jpeg)
>
Choose the tab.
>
Here you can see the actual tasks that are running. You might have
more than one task running per service that you defined.

![Image 244]({{ site.baseurl }}/assets/img/posts/image244.jpeg)

Choose the link for one of the listed tasks. You might only have one.
>
Here you can see the actual container details and the configuration
information, such as the IP addresses that are associated with the
running container.
>
![Image 245]({{ site.baseurl }}/assets/img/posts/image245.jpeg)

5.  Return to the CodeDeploy page that is open in another browser tab.

You should now see that all five steps of the deployment succeeded and
the replacement task set is now serving traffic.
>
![Image 246]({{ site.baseurl }}/assets/img/posts/image246.jpeg)

6.  Observe the load balancer and target group settings.

In the Amazon EC2 console, choose .

![Image 247]({{ site.baseurl }}/assets/img/posts/image247.jpeg)

Observe the HTTP:80 listener rules.
>
The default rule has changed here. The default "if no other rule
applies" rule previously pointed to *customer-tg-two*, but now it
points to *customer-tg-one*. This is because CodeDeploy actively
managed your Application Load Balancer.

![Image 248]({{ site.baseurl }}/assets/img/posts/image248.jpeg)

Now go to EC2 â†’ Load Balancers â†’ microservicesLB â†’ Listeners â†’ HTTP :
80 â†’ View rules Observe the HTTP:8080 listener rules.
>
The two rules still forward to the "one" target groups.

![Image 249]({{ site.baseurl }}/assets/img/posts/image249.jpeg)

Congratulations! You successfully deployed one of the two
microservices to Amazon ECS on Fargate by using a CI/CD pipeline.

# Task 8.4: Create a pipeline for the employee microservice

In this task, you will create the pipeline for the *employee*
microservice.

1.  Create a pipeline for the microservice with the following
    specifications:

    - Pipeline name: update-employee-microservice

    - Role ARN:

    - Source provider:

    - Repository name:

    - Branch name:

    - Deploy provider:

    - AWS CodeDeploy application name:

    - AWS CodeDeploy deployment group:

    - Amazon ECS task definition:

    - Path: taskdef-employee.json

    - AWS CodeDeploy AppSpec file:

    - Path: appspec-employee.yaml

![Image 251]({{ site.baseurl }}/assets/img/posts/image251.jpeg)

![Image 252]({{ site.baseurl }}/assets/img/posts/image252.jpeg)
>
![Image 253]({{ site.baseurl }}/assets/img/posts/image253.jpeg)
>
**(D You cannot skip this stage**
>
Pipelines must have at lea:st two stages. Your second stage must be
either a build, test or deployment stage. Choose a provider for either
the build stage, test stage or deployment stage.
>
**Deploy**
>
**Depl.oy provider**
>
Choose how you want to deploy your application or content. Choose the
provider, and then provide the configuration details for that
provider.
>
\[ Amazon ECS (Blue/Green)
>
**Region**
>
\[ United States (N. Virginia)
>
**Input artifacts**
>
Choose an input artifact for this action. Learn more I!\'
>
SourceArtifact **X**
>
Defined by: Source
>
**No** more than 100 characters
>
**AWS CodeDeploy application name**
>
Choose one of your existing applications, or create a new one in AWS
CodeDeploy.
>
\[ï¿½\_O. m_i_cr_o_s_e_rv_ic_e_s [x]{.underline}\_J( **Create
application** I!\' )
>
**AWS CodeDeploy deployment group**
>
Choose one of your existing deployment groups, or create a new one in
AWS CodeDeploy.
>
\[ **O.** microservices-employee xJ
>
**Amazon ECS task definition**
>
Choose the input artifact where your Amazon ECS task definition file
is stored. If other than the default file path, specify the path and
filename of your task definition file.
>
\[ SourceArtifact â€¢ J \[ taskdef-employee.json J
>
The default path is taskdef.json.
>
**AWS CodeDeploy AppSpec file**
>
Choose the input artifact where your AWS CodeDeploy AppSpec file is
stored. If other than the default file path, specify the path and
filename of your AppSpec file.
>
\[ SourceArtifact â€¢ J \[ appspec-employee.yaml J
>
**Dynamically update task definition image - *optional***
>
You can provide an input artifact and a placeholder name for the
container definition image that **will** be used to dynamically update
a task definition. You can specify multiple input artifacts and
placeholders.
>
**lnn11t :1rtifart with im:1n\<\>n1\>t:1ik**
>
![Image 254]({{ site.baseurl }}/assets/img/posts/image254.jpeg)

2.  Add another *source* to the employee microservice pipeline. Add an
    action with the following details:

    - Action name: Image

    - Action provider:

    - Repository name:

    - Image tag:

    - Output artifacts: image-employee

click on edit source and then add action:

![Image 255]({{ site.baseurl }}/assets/img/posts/image255.jpeg)

3.  Edit the Amazon ECS (Blue/Green) action in the deploy stage: edit
    deploy:

![Image 256]({{ site.baseurl }}/assets/img/posts/image256.jpeg)

- Add another and choose .

- Under , for , choose .

- For , enter IMAGE1_NAME

![Image 257]({{ site.baseurl }}/assets/img/posts/image257.jpeg)
>
save.

# Task 8.5: Test the CI/CD pipeline for the employee microservice

1.  Launch a deployment of the microservice on Amazon ECS on Fargate.

    - Use the feature to force a test of the pipeline.

    - Follow the progress in CodeDeploy. Within a few minutes, if
      everything was configured correctly, all of the should succeed.

click on release change.
>
![Image 259]({{ site.baseurl }}/assets/img/posts/image259.jpeg)

![Image 260]({{ site.baseurl }}/assets/img/posts/image260.jpeg)

All succeeded.

2.  Load the *employee* microservice in a browser tab.

In the browser tab where the customer microservice is running, choose
.

![Image 261]({{ site.baseurl }}/assets/img/posts/image261.jpeg)

Choose or .The suppliers page should load. This version of the page
should have the edit or add supplier buttons. All links in the cafÃ©
web application should now work because you have now deployed both
microservices.
>
![Image 262]({{ site.baseurl }}/assets/img/posts/image262.jpeg)
>
âœ”Admin UI loads
>
âœ”Add / Edit / Delete works
>
âœ”Customer â†” Admin navigation works

3.  Observe the running tasks in the Amazon ECS console. The
    **Deployments and tasks** status will change as the blue/green
    deployment advances through its lifecycle events.

![Image 263]({{ site.baseurl }}/assets/img/posts/image263.jpeg)

4.  Return to the CodeDeploy page to confirm that all five steps of the
    deployment succeeded and the replacement task set is now serving
    traffic.

![Image 264]({{ site.baseurl }}/assets/img/posts/image264.png)

# Task 8.6: Observe how CodeDeploy modified the load balancer listener rules

1.  Observe the load balancer and target group settings.

In the Amazon EC2 console, choose .

![Image 265]({{ site.baseurl }}/assets/img/posts/image265.jpeg)

observe the HTTP:80 listener rules.
>
![Image 266]({{ site.baseurl }}/assets/img/posts/image266.jpeg)
>
Observe the HTTP:8080 listener rules.

![Image 267]({{ site.baseurl }}/assets/img/posts/image267.jpeg)

# Phase 9: Adjusting the microservice code to cause a pipeline to run again

In this phase, you will experience the benefits of the microservices
architecture and the CI/CD pipeline that you built. You will begin by
adjusting the load balancer listener rules that are related to the
*employee* microservice. You will also update the source code of the
*employee* microservice, generate a new Docker image, and push that
image to Amazon ECR, which will cause the pipeline to run and update
the production deployment. You will also scale up the number of
containers that support the *customer* microservice.

# Task 9.1: Limit access to the employee microservice

In this task, you will limit access to the *employee* microservice to
only people who try to connect to it from a specific IP address. By
limiting the source IP to a specific IP address, only users who access
the application from that IP can access the pages, and edit or delete
supplier entries.

1.  Confirm that all target groups are still associated with the
    Application Load Balancer.

In the Amazon EC2 console, check that all four target groups are still
associated with the load balancer. Reassociate target groups as needed
before going to the next step.

![Image 269]({{ site.baseurl }}/assets/img/posts/image269.jpeg)

we need to Reassociate.

- customer-tg-two â†’

- employee-tg-one â†’ To do this:

edit the first one rule:

![Image 270]({{ site.baseurl }}/assets/img/posts/image270.jpeg)

add employee-tg-one and save:
>
![Image 271]({{ site.baseurl }}/assets/img/posts/image271.jpeg)
>
for customer-tg-two:
>
in http:8080:
>
add like this and save:

![Image 272]({{ site.baseurl }}/assets/img/posts/image272.jpeg)![Image 273]({{ site.baseurl }}/assets/img/posts/image273.jpeg)

2.  Discover your public IPv4 address.

![Image 274]({{ site.baseurl }}/assets/img/posts/image274.jpeg)

3.  Edit the rules for the **HTTP:80** listener.

For the rule that currently has "IF Path is /admin/\*" in the details,
add a second condition to route the user to the target groups only if
the source IP of the request is your IP address.
>
EC2 â†’ Load Balancers â†’ **microservicesLB**
>
Listeners â†’ **HTTP:80**

![Image 275]({{ site.baseurl }}/assets/img/posts/image275.jpeg)

![Image 276]({{ site.baseurl }}/assets/img/posts/image276.jpeg)
>
Find rule:
>
IF Path is /admin/\*
>
Click **Edit rule**
>
Add condition:
>
![Image 277]({{ site.baseurl }}/assets/img/posts/image277.png) Value: YOUR.IP.ADDRESS/32

![Image 278]({{ site.baseurl }}/assets/img/posts/image278.jpeg)

save.

4.  Edit the rules for the **HTTP:8080** listener.

Edit the rules in the same way that you edited the rules for the
**HTTP:80** listener. You want access to the employee target groups to
be limited to your IP address.
>
same steps for port 8080.
>
![Image 279]({{ site.baseurl }}/assets/img/posts/image279.jpeg)

# Task 9.2: Adjust the UI for the employee microservice and push the updated image to Amazon ECR

In this task, you will adjust the deployed microservices.

1.  Edit the employee/views/**nav.html** file.

On line 1, change navbar-dark bg-dark to navbar-light bg-light
>
in cloud9 terminal:
>
\~/environment/microservices/employeenano views/nav.html

![Image 281]({{ site.baseurl }}/assets/img/posts/image281.jpeg)

change line 1 like this.
>
Save the change.

2.  To generate a new Docker image from the *employee* microservice
    source files that you modified and to label the image, run the
    following commands:

docker -f employee_1 \~/environment/microservices/employeedocker build
\--tag employee
>
.dbEndpoint=\$(
\~/environment/microservices/employee/app/config/config.js \| grep \|
-d
>
-f2) account_id=\$(aws sts get-caller-identity \|grep Account\| -d
-f4) docker tag employee:latest
.dkr.ecr.us-east-1.amazonaws.com/employee:latest
>
![Image 282]({{ site.baseurl }}/assets/img/posts/image282.jpeg)

3.  Push an updated image to Amazon ECR so that the
    *update-employee-microservice* pipeline will be invoked

    - In the CodePipeline console, navigate to the details page for the
      pipeline. Keep this page open.

    - To push the new employee microservice Docker image to Amazon ECR,
      run the following commands in your AWS Cloud9 IDE:

aws ecr get-login-password \--region us-east-1 \| docker login
\--username AWS \--password-stdin
.dkr.ecr.us-east-1.amazonaws.comdocker push
.dkr.ecr.us-east-1.amazonaws.com/employee:latest

![Image 283]({{ site.baseurl }}/assets/img/posts/image283.jpeg)

# Task 9.3: Confirm that the employee pipeline ran and the microservice was updated

1.  Observe the pipeline details in the CodePipeline console.

![Image 284]({{ site.baseurl }}/assets/img/posts/image284.jpeg)

2.  Observe the details in the CodeDeploy console.

![Image 285]({{ site.baseurl }}/assets/img/posts/image285.jpeg)

# Task 9.4: Test access to the employee microservice

1.  Test access to the microservice pages at
    http://\<alb-endpoint\>/admin/suppliers and
    http://\<alb-endpoint\>:8080/admin/suppliers from the same device
    that you have used for this project so far. Replace with the DNS
    name of the load balancer.

![Image 286]({{ site.baseurl }}/assets/img/posts/image286.jpeg)

2.  Test access to the same *employee* microservice pages from a
    different device.

![Image 287]({{ site.baseurl }}/assets/img/posts/image287.jpeg)

This proves IP restriction works.

# Task 9.5: Scale the customer microservice

In this task, you will scale up the number of containers that run to
support the *customer* microservice. You can make this change without
causing the *update-customer-microservice* pipeline to run.

1.  Update the service in Amazon ECS. Run the following command:

aws ecs update-service microservices-serverlesscluster
customer-microservice
>
A large JSON-formatted response is returned.
>
![Image 288]({{ site.baseurl }}/assets/img/posts/image288.jpeg)
>
Go to the Amazon ECS services view.
>
ECS â†’ Clusters â†’ microservices-serverlesscluster â†’ Services

![Image 289]({{ site.baseurl }}/assets/img/posts/image289.jpeg)

This ends the lab.







