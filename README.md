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

**INITIAL SCREEN**

Source is displayed as HTML, the header of the page shows two buttons and the
license. By default, the source is this file.

Buttons are:
(PEN) Edit source
(FILE) Open file / Drop file target

1. Click on (PEN): go to SOURCE DISPLAY

2. Click on (FILE) or Drag and Drop on it, go to KEY DEFINITION

(Loading source means load file and de-cypher with no key)

**KEY DEFINITION**

Buttons are:
(UNLOCK) Apply the current key and go to DISPLAY SCREEN
(SAVE) Download the file (provided it has been previously unlocked)
=> PB

KEYs appear as boxes with options. There is always a 'new key' placeholder.
When used to create a key, a new placeholder is created.

**DISPLAY DEFINITION**

Buttons are:
(PEN) Edit source
(LOCK) Go to **KEY DEFINITION**

## Features

* Compatible with several platforms

## Background

