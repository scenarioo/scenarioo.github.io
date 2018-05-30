# Scenarioo Webpage

Project webpage for http://www.scenarioo.org

based on Single Page template https://github.com/t413/SinglePaged

## How to change the webpage

Simply change the html and markdown files in the repository 'scenarioo.github.io'.

Simple push your changes to the master branch - rest is done by github pages for you and the page will be available for browsing here: http://scenarioo.org

**Attention**: If you work for documentation of a future release, then do not work on the main branch but change the web page on an appropriate release branch!

## Jekyll Setup for generating Webpage and Documentation

You can use local tooling for browsing the page as well, but beware that these instructions here might not be up to date with latest and greatest setup of github pages ...

You need to install Jekyll and all prerequisites on your development environment machine, as explained here under https://help.github.com/articles/using-jekyll-with-pages/.

This was what I did once long time ago on the scenarioo dev VM to get it installed (beware that this instructions might be long time outdated and not in synch with what github pages use today):

 * Install Ruby 2.x:
   See also http://rvm.io/ for how to install ruby version manager (RVM) to get newest ruby version, I did the following steps on the VM:
    * `sudo apt-get update`
    * `gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3`
    * `sudo apt-get install curl`
    * `\curl -sSL https://get.rvm.io | bash -s stable`
    * `source /home/scenarioo/.rvm/scripts/rvm`
    * `rvm get stable`
    * `rvm install ruby2.2.1`
 * Install Jekyll:
    * `gem install bundler`
    * call the following command inside the 'scenarioo.github.io' directory (where Gemfile is checked in): 
      `bundle install`

## How to generate and review docu

you can browse the webpage locally, by calling the following commands inside directory 'scenarioo.github.io':
 * `jekyll serve`
 * browse to localhost:4000

To be sure that the compilation is similar and uptodate with github pages, you should maybe use the following instead:
 * ??? outdated here - sorry!
 
## How to release the webpage to github pages

Follow the usual release process, and merge the changes you made to the master branch

If you checkin on master branch your change is directly released.

## How to deploy the Documentation

* The Sources for the Docu are located here: https://github.com/scenarioo/scenarioo/tree/develop/docs

* Further instructions can be found here: 

# Working with Single Page Template

Following docu is from Single Page Template repo ...

## Basic structure


- Each vertical section is a markdown file in **_posts/** directory.
  * They're sorted by 'date'. (we don't use date anywhere, it only sorts)
- Each vertical section sets it's own **color**, **header icon** (or image), **title**, and easy-to-write markdown body.
- Only **two things** to edit:
  1. Edit `_config.yml` to set the site title, description, etc
  2. Add _posts/*.md to make each vertical section. Copy some examples and add the sections from your README.md for a fast start!
- Easy adding of **SEO terms**, **favicon** & such, and **google analytics token**.


## Usage

- Edit `_config.yml` to change your title, keywords, and description.
- Create a new file in `_posts/` called `2014-01-01-intro.md`
  Edit it, and add:

~~~
  ---
  title: "home"
  bg: white     #defined in _config.yml, can use html color like '#010101'
  color: black  #text color
  style: center
  ---

  # Example headline!
  and so on..
~~~

- Create a second post called `2014-01-02-art.md` with an divider image this time:

~~~
  ---
  title: "Art"
  bg: turquoise  #defined in _config.yml, can use html color like '#0fbfcf'
  color: white   #text color
  fa-icon: paint-brush
  ---

  #### A new section- oh the humanity!
~~~

**Note:** That part `fa-icon: paint-brush` will use a font-awesome icon of [paint-brush](http://fortawesome.github.io/Font-Awesome/icon/paint-brush/). You can use any icon from this [font-awesome icon directory](http://fortawesome.github.io/Font-Awesome/icons/).

- install Jekyll with `sudo gem install github-pages`
- run `jekyll serve -w`
  - visit [localhost:4000](http://localhost:4000) to see a live locally served preview.
- Push changes and see them live!




## Changing your colors

- In each post file you can define `bg: mycolor` and `color: myothercolor` to change the background and text colors for that section.
- **mycolor** can be a quoted html color like `'#0fbfcf'` or a key to a special color defined in **_config.yml** under 'colors'.
  - **Note:** Changes to _config.yml require a manual restart to your local server with `^C` and `jekyll serve -w`.

Nifty, right!



## Updating

So you've got a copy running and there's some new update? Let's update!

1. Checkout your github-pages branch
  - `git checkout gh-pages` for a standalone or existing page
  - `git checkout master` for a *username.github.io* page
2. run `git remote | grep -q "singlepage" || git remote add -t publish singlepage https://github.com/t413/SinglePaged.git` to be sure you have access to this repository (you can run this command at any time).
2. `git fetch singlepage` to fetch-in-place new changes.
3. Update to the new base (using merge)
    1. `git merge singlepage/publish`
4. You can alternatively update using rebase. This *rewrites history* (**bad**), but it is cleaner.
    1. `git rebase singlepage/publish`
