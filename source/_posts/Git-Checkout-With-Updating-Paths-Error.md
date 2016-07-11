title: Git Checkout With Updating Paths Error
date: 2016-07-11 15:52:51
categories:
- Git
tags:
- Git
---

During co-development process, after we fork a repository, we always want to keep up our own repo updated with the original repo, then when I want to checkout a branch that tracking a branch on original remote, an error occurs.

    $ git remote -v
    origin  git@github.corp.ebay.com:yuren/app-browse.git (fetch)
    origin  git@github.corp.ebay.com:yuren/app-browse.git (push)
    upstream    git@github.corp.ebay.com:Stubhub/app-browse.git (fetch)
    upstream    git@github.corp.ebay.com:Stubhub/app-browse.git (push)

    $ git checkout -B develop upstream/develop
    fatal: Cannot update paths and switch to branch 'develop' at the same time.
    Did you intend to checkout 'upstream' which can not be resolved as commit?

Here listed a correct answer from [stackoverflow](http://stackoverflow.com/questions/945654/git-checkout-updating-paths-is-incompatible-with-switching-branches). It works for me.

    $ git remote update
    $ git checkout -B develop upstream/develop