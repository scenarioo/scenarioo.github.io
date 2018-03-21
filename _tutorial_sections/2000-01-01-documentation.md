---
title: "Documentation"
---

[Documentation of latest release](http://scenarioo.org/docs/)

[Documentation of development version](https://github.com/scenarioo/scenarioo/tree/develop/docs) (for contributors)

## Video: A short introduction to Scenarioo

Shows the essential features of Scenarioo and gives you some first insights into the Scenarioo documentation format structure.

<iframe width="883" height="497" src="https://www.youtube-nocookie.com/embed/C_Omyu190V4?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Introductory Tutorial

**Note: This tutorial is still work in progress and may be incomplete in some places. We apologize!** 
<br/>

The goal of this tutorial is to integrate Scenarioo in a minimal way to demonstrate its basics.


#### Using Scenarioo in Java Selenium Tests

This tutorial uses **Selenium** with Java and the **Scenarioo Writer Library for Java**. Just continue to read.
 
#### Using Scenarioo in C# Selenium Tests

Using Scenarioo in C# tests is very similar to the examples in Java in this tutorial, so this tutorial might also be interesting for you.

More specific information about the C# Writer Library can be found here: 
<a href="https://github.com/scenarioo/scenarioo-cs/wiki/How-to-use-the-C%23-Scenarioo-Writer-Library" target="_blank">Scenarioo C# Writer Library Wiki</a>

#### Using Scenarioo in Javascript Protractor or WebdriverJS Tests

Please refer to the following documentation, for how easy it is to use it in your Javascript tests with Protractor or WebdriverJS:
<a href="https://github.com/scenarioo/scenarioo-js/blob/master/README.md" target="_blank">ScenariooJS Writer Library</a>

#### Setup the Scenarioo Viewer Web App
1. If you haven't already, download a tomcat application server from http://tomcat.apache.org/.
2. Deploy the Scenarioo client application from https://github.com/scenarioo/scenarioo/releases by copying the war file into the web apps folder.
3. Set the context parameter within the conf/context.xml of your tomcat to a writable directory (e.g. your user home).

```
    <Parameter name="configurationDirectory" value="/home/myuser/scenarioo/" override="true" description="Location of scenarioo config.xml file"/>
```

#### Demo web app and Selenium tests
We are testing a static GitHub website available on <a href="http://scenarioo.github.io/scenarioo-hello-world-app/index.html" target="_blank">http://scenarioo.github.io/scenarioo-hello-world-app/index.html</a>. There are two tests for one use case with two different scenarios:

1. A page showing the entered user name
2. A page showing a static user name

Please checkout the branch course-start

    git clone https://github.com/scenarioo/scenarioo-hello-world.git
    git checkout course-start

Execute the tests first, either in your favorite IDE or using gradle

    ./gradlew test


#### Import example build
There's already a generated scenarioo build in the data folder. The structure is

File										| Description
--------------------------------------------|------------------------
branch/branch.xml 					| contains information about your branch (name and description)
branch/build/build.xml 				| contains information about your build (generation date, revision, ...)
branch/build/usecase1/usecase.xml 	| contains name, description and generic information about your use case
branch/build/usecase1/scenario1/scenario.xml | contains name, description and generic information about your use case
branch/build/usecase1/scenario1/screenshots/*.png | contains a screenshot per steps branch/build/usecase1/scenario1/steps/*.xml | contains an xml per step specifying a variety of information



First we will tell Scenarioo where it can find the above data. Browse to your Scenarioo web app and open 'Manage' -> 'General Settings'. Insert an absolute path to the documentation data into the field 'Documentation Data Directory Path'. Next open the tab 'Builds' and press ' Import & Update Builds'. Now the specified build will appear.

You may now browse the imported use case and its scenarios.

#### Set up dependencies
If you look at the gradle build file, you will see an important dependency:

{% highlight groovy %}
dependencies {
    ...
    compile 'org.scenarioo:scenarioo-java:2.0.+'
}
{% endhighlight %}

The Scenarioo-Java API will help you to create the proper files. You could do this on your own but for the sake of simplicity we will use it in this example.

#### Writing branch and build information
Usually you would write your branch.xml and build.xml before your build starts on your CI environment. In this tutorial we will use our predefined branch and build in your projects data folder.

#### Writing use case and scenario information
In our example tests, each class is a use case and each test method is a scenario. Now we would like to write a JUnit rule which does exactly that: 

{% highlight java linenos %}
package org.scenarioo.selenium;

import org.junit.rules.TestRule;
import org.junit.runner.Description;
import org.junit.runners.model.Statement;
import org.scenarioo.api.ScenarioDocuWriter;
import org.scenarioo.model.docu.entities.Scenario;
import org.scenarioo.model.docu.entities.UseCase;

public class ScenariooRule implements TestRule {

  private ScenarioDocuWriter writer;
  
  public ScenariooRule(ScenarioDocuWriter writer) { // (1)
    this.writer = writer;
  }
  
  @Override
  public Statement apply(final Statement base, final Description description) {
    return new Statement() {

      @Override
      public void evaluate() throws Throwable {
        saveUseCase(description); // (2)
        saveScenario(description); 
        writer.flush();
        base.evaluate();
      }

      private void saveScenario(Description description) {
        Scenario scenario = new Scenario();
        scenario.setName(description.getMethodName()); // (4)
        writer.saveScenario(getUseCaseName(description), scenario);
      }


      private void saveUseCase(Description description) {
        UseCase useCase = new UseCase();
        useCase.setName(getUseCaseName(description));
        writer.saveUseCase(useCase);
      }
      
      private String getUseCaseName(Description description) {
        return description.getTestClass().getSimpleName(); // (3)
      }
    };
  }
}

{% endhighlight %}

We will take a **ScenarioDocuWriter** in our constructor **(1)**. It knows which branch and build it should use and will allow us to create the required usecase.xml and scenario.xml files. As you can see at **(2)**, we create a use case for each test method which will be executed. Usually we would do this only once per test class. We will use the class name for each use case **(3)**. We will do the same for the current scenaro by using the method name **(4)**.

Now we will need to create an instance of ScneariooDocuWriter in our test class and add our rule:

{% highlight java linenos %}
public class ShowNameTest {
  
  private ScenarioDocuWriter writer = new ScenarioDocuWriter(new File("data"), "mybranch", "mybuild");
  
  @Rule
  public ScenariooRule scenariooRule = new ScenariooRule(writer);
{% endhighlight %}

We specify constant values for our branch and build. The build would usually change for each test execution. This will do for the moment to keep it simple.

Execute your tests. You will see that a scenario.xml has been generated for each test including the corresponding directories.


#### Writing step information
The last piece missing are the step information. Within the data structure a step.xml contains step and page information. Scenarioo expects a step for each action in your application (e.g. opening a window, fill out a form, submit a form, ...). A step contains 1 page information which is basically the view of your step. A page is identified by its name. 

In Selenium we have the possibility to intercept each action (e.g. page load, before click, after click, ...) using an **EventFiringWebdriver** in which we can register a listener. First we will create such a listener:

{% highlight java linenos %}
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.events.AbstractWebDriverEventListener;
import org.scenarioo.api.ScenarioDocuWriter;
import org.scenarioo.model.docu.entities.Page;
import org.scenarioo.model.docu.entities.Step;
import org.scenarioo.model.docu.entities.StepDescription;
import org.scenarioo.model.docu.entities.StepHtml;

public class ScenariooSeleniumListener extends AbstractWebDriverEventListener {
  
  private ScenarioDocuWriter writer;
  private ScenariooRule rule;

  private int currentIndex = 0;
  
  public ScenariooSeleniumListener(ScenarioDocuWriter writer, ScenariooRule rule) {
    this.writer = writer; // (1)
    this.rule = rule; // (2)
  }

  @Override
  public void afterClickOn(WebElement element, WebDriver driver) {
    writeStep(driver); // (3)
  }
  
  @Override
  public void afterNavigateTo(String url, WebDriver driver) {
    writeStep(driver); // (3)
  }

  private void writeStep(WebDriver driver) {
    Step step = new Step(); // (4)
    step.setHtml(new StepHtml(driver.getPageSource()));
    
    StepDescription stepDescription = new StepDescription(); // (5)
    stepDescription.setTitle(driver.getTitle());
    stepDescription.setIndex(currentIndex);
    step.setStepDescription(stepDescription);
    
    step.setPage(new Page(sanitizeUrl(driver.getCurrentUrl()))); // (6)

    TakesScreenshot screenshotDriver = (TakesScreenshot) driver;
    byte[] screenshot = screenshotDriver.getScreenshotAs(OutputType.BYTES); // (7)
    writer.saveScreenshotAsPng(rule.getCurrentUsecase().getName(), rule.getCurrentScenario().getName(), currentIndex++, screenshot); (8)
    writer.saveStep(rule.getCurrentUsecase(), rule.getCurrentScenario(), step); // (9)
    writer.flush();
  }
  
  private String sanitizeUrl(String currentUrl) {
    currentUrl = currentUrl.replaceAll("http://scenarioo.github.io/scenarioo-hello-world-app/", "");
    currentUrl = currentUrl.replaceAll("\\?.*", "");
    currentUrl = currentUrl.replaceAll("/", "#");
    
    return currentUrl;
  }
}
{% endhighlight %}

1. We take the **ScenarioDocuWriter** as constructor parameter allowing us to write into the correct branch and build directory.
2. We need the rule to know where to put step data.
3. We override only two events. We want to take a screenshot after each page load and when the test clicks on something. There are many more methods which allow you to do a more fine grained configuration.
4. First we create a new step and add the HTML source of the page.
5. In the step description we put the page title, which will be shown as title on each step. The index is required for Scenarioo to know the order of the steps.
6. The Page (view) is in our case the html page. To make the page more readable, we don't display the domain nor parameters (e.g. ''?name=something'').
7. The most powerful and important part is saving the screenshot, which will be displayed on each step.
8. We persist the screenshot in the correct directory using the ScenarioDocuWriter.
9. Finally we save all step information.

As you can see, we need to extend to extend the ScenariooRule interface, that we can access the current use case and scenario **(1)**:

{% highlight java linenos %}

public class ScenariooRule implements TestRule {

  private ScenarioDocuWriter writer;
  
  // (1)
  private UseCase currentUsecase;
  private Scenario currentScenario;
	
	...
	
  public Scenario getCurrentScenario() {
    return currentScenario;
  }
    
  public UseCase getCurrentUsecase() {
    return currentUsecase;
  }
}
{% endhighlight %}