# GPF Cypher

A cyphering tool developed in JavaScript and based on gpf library.
Created and maintained by [Arnaud Buchholz](http://gpf-js.blogspot.com/).

## How to

There are mainly two tasks achievable with this tool:

* Input a text file and generate a cyphered version of it
* Load a cyphered file and retrieve the original text file

The cyphering algorithm is based on a simple - but layered - obfuscation
mechanism that generates unpredictable patterns (provided you use enough
layers).

### UX

**Vocabulary**

*Source* the original text file. It will be interpreted as a
[Markdown](http://en.wikipedia.org/wiki/Markdown) file and displayed as HTML

*Key* a cyphering layer, it can be

* Any file (of any length)
* An input string (of any length)
* A path (of any length) defined in a 3x3 grid

*File* represents the result of source cyphered with different keys

**DISPLAY SCREEN**

Source is displayed as HTML, the header of the page shows a toolbar.
By default, the source is this file.

Buttons are:
(EDIT) go to SOURCE SCREEN
(FILE) Open file / Drop file target to go to KEY SCREEN
(INFO) go to INFO SCREEN

(Loading source means load file and de-cypher with no key)

**INFO SCREEN**

The about box is displayed.

Buttons are:
(BACK) Back to the previous screen

**SOURCE SCREEN**

This screen is used to edit the source file.

Buttons are:
(VIEW) Go to DISPLAY SCREEN
(LOCK) Go to KEY SCREEN
(SAVE) Download cyphered source (using defined keys)
(INFO) Display the about box

**KEY SCREEN**

Buttons are:
(UNLOCK) Apply the current key and go to DISPLAY SCREEN
(SAVE) Download cyphered source (using defined keys)
(INFO) Display the about box

KEYs appear as boxes with options. There is always a 'new key' placeholder.
When used to create a key, a new placeholder is created.

## Features

* Compatible with several platforms

## Background

