title: Error in initializing Git Extension
date: 2015-07-15 10:46:46
categories:
- Git
tags:
- GitExtension
- Git
---

## Problem

When initialize git extensions, an exception thrown by the type initializer for GitCommands.AppSettings

Popup window says:

> __System.Xml.XmlException__

Exception Details:

> System.TypeInitializationException: An exception was thrown by the type initializer for GitCommands.AppSettings ---> System.Xml.XmlException: Unexpected XML declaration. The XML declaration must be the first node in the document, and no white space characters are allowed to appear before it. Line 104, position 9.

## Solution

The problem was in the file
/home/user/.local/share/GitExtensions/GitExtensions.exe_Url_fc9221118986807f24034ab13ad4e7143ae90814/user.config

Contain malformed XML.

Remove the file, and problem gone.

Why? No reason found on web. Waiting to see further details.

Source: https://github.com/gitextensions/gitextensions/issues/2710