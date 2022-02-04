# Hybrid Js Utils 3

## 2.0.2
* Added tests with Jest
* Refactor
* README improved
* Cleanup (removed useless files)
* Added changelog

## 2.0.3
* Fixed countdown not setting to 0 in some cases
* Added counter value in the return Promise for countdown

## 2.0.4
* Added methods for 
    * objectKeysToCamelCase
    * randomNumericString
    * sprintf
    * toCamelCase
    * toSnakeCase
    
## 2.0.5
* Improve sprintf

## 2.0.7
* Fix use-before-declare

## 2.0.8
* Added forEachFrom to iterate over arrays starting at custom index

## 2.0.9
* Fixed eachFrom alias not using custom index
* Added tests for eachFrom / forEachFrom
* Removed useless dependency
* Changed rollup extension (since it was pointlessly ts)

## 3.0.0
* Changed source to class. Major version update because of the dramatic change, but it should continue to work as it did before, so it will be most likely compatible with previous installations.

## 3.0.1
* Improved sprintf to print everything! 🎉

## 3.0.2
* Fixed this ref (which may be messing when using single functions)

## 3.0.3
* Reverted sprintf. If you want to print an object, convert it first!
* Adding version constant inside of js-utils

## 3.0.4
* Fix shadowed name

## 3.0.5
* Added settings to customise sprintf
* Added sprintfx where you also pass the needle

## 3.0.6
* Fixed sprintfx

## 3.0.7
* Typescript fixes

## 3.0.8
* Improved toCamelCase and toSnakeCase to better handle input

## 4.0.0
* Breaking change: removed loadJquery, because it's pointless

## 4.0.1
* Improved toCamelCase and toSnakeCase to better handle input
