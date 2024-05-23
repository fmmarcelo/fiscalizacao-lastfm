# Fiscalização Last.fm

![Picture of a shiba inu wearing a cap with the message "Fiscalização Last.fm" embroidered in it.](/doge.png)

CLI for listing a user's top albums, artists or tracks of a given period from Last.fm. It uses webscrapping so login is not needed.

## Installation

Install the dependencies
```
$ npm install
```
Link the app with npm
```
$ npm link
```
## Usage examples

Show last week's top albums without play count
```
$ flastfm username
```
Show last year's top tracks with play count
```
$ flastfm username -t -365 -p
```
## Limitations

In order to avoid login and make it portable, this software can provide only what Last.fm's website provides for an unlogged visitor.
So you can check only fixed periods of time: last week, month, 3 months, 6 months, year or all time.
The top number is fixed to 5 for albums and artists, and 10 for tracks.