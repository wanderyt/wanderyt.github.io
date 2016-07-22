title: Git Flow With Branch Sync
date: 2016-07-22 17:36:25
categories:
- Git
tags:
- Git
---

During the collaborative development, it is easy to find out that the local branch of your own repo is out-dated with the branch in remote repo.

For example, there is a repo named `remote/repo`. Then you fork it within your own github as `you/repo`.

To keep the `develop` branch in `you/repo` with the `develop` in `remote/repo`, the following steps may be needed.

### Checkout

Checkout two develop branches.

    $ git checkout -b remote-develop remote/develop
    $ git checkout -b develop you/develop

### Merge

If there are commits after the lastest sync, the `remote-develop` will be ahead of `develop` with several changes. Then you need to keep the `develop` with `remote-develop`.

    $ git checkout develop
    $ git merge remote-develop

Then you have updated the local branch `develop` with lastest code. Finally the update for `you/repo` should be made to keep the two repos sync.

    $ git push you develop
