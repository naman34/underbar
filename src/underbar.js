/*jshint eqnull:true, expr:true*/

var _ = { };

(function() {

  // Returns whatever value is passed as the argument. This function doesn't
  // seem very useful, but remember it--if a function needs to provide an
  // iterator when the user does not pass one in, this will be handy.
  _.identity = function(val) {
    return val;
  };

  /**
   * COLLECTIONS
   * ===========
   *
   * In this section, we'll have a look at functions that operate on collections
   * of values; in JavaScript, a 'collection' is something that can contain a
   * number of values--either an array or an object.
   */

  // Return an array of the first n elements of an array. If n is undefined,
  // return just the first element.
  _.first = function(array, n) {
    return n === undefined ? array[0] : array.slice(0, n);
  };

  // Like first, but for the last elements. If n is undefined, return just the
  // last element.
  _.last = function(array, n) {
    if(!!Array.isArray(array)){
      return n === undefined ? array[array.length - 1] : 
                               n < array.length ? array.slice(array.length - n, array.length) :
                               array;
    } else {
      return "last expects an Array as the first argument.";
    }
  };

  // Call iterator(value, key, collection) for each element of collection.
  // Accepts both arrays and objects.
  //
  // Note: _.each does not have a return value, but rather simply runs the
  // iterator function over each item in the input collection.
  _.each = function(collection, iterator) {
    if(!!Array.isArray(collection)) {
      for(var i = 0; i < collection.length; i++){
        iterator(collection[i], i, collection);
      }
    } else if(typeof collection === "object") {
      for ( var key in collection) {
        iterator(collection[key], key, collection);
      }
    }
  };

  // Returns the index at which value can be found in the array, or -1 if value
  // is not present in the array.
  _.indexOf = function(array, target){
    // TIP: Here's an example of a function that needs to iterate, which we've
    // implemented for you. Instead of using a standard `for` loop, though,
    // it uses the iteration helper `each`, which you will need to write.
    var result = -1;

    _.each(array, function(item, index) {
      if (item === target && result === -1) {
        result = index;
      }
    });

    return result;
  };

  // Return all elements of an array that pass a truth test.
  _.filter = function(collection, test) {

    var filteredArray = [];

    _.each(collection, function(element, index){
      if(!!test(element, index)){
        filteredArray.push(element);
      }
    });

    return filteredArray;

  };

  // Return all elements of an array that don't pass a truth test.
  _.reject = function(collection, test) {
    // TIP: see if you can re-use _.filter() here, without simply
    // copying code in and modifying it
    var inverseFunction = function(element, index){
      return !test(element, index);
    };

    return _.filter(collection, inverseFunction);
  };

  // Produce a duplicate-free version of the array.
  _.uniq = function(array) {

    if(!Array.isArray(array)){
      return "argument must be an array";
    }

    var uniqueArray = [];

    _.each(array, function(element, index){
      if(_.indexOf(uniqueArray, element) === -1){
        uniqueArray.push(element);
      }
    });

    return uniqueArray;

  };


  // Return the results of applying an iterator to each element.
  _.map = function(array, iterator) {
    // map() is a useful primitive iteration function that works a lot
    // like each(), but in addition to running the operation on all
    // the members, it also maintains an array of results.
    if(!Array.isArray(array)){
      return "argument must be an array";
    }

    var mappedArray = [];

    _.each(array, function(element, index){
      mappedArray.push(iterator(element, index));
    });

    return mappedArray;

  };

  /*
   * TIP: map is really handy when you want to transform an array of
   * values into a new array of values. _.pluck() is solved for you
   * as an example of this.
   */

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  _.pluck = function(array, propertyName) {
    // TIP: map is really handy when you want to transform an array of
    // values into a new array of values. _.pluck() is solved for you
    // as an example of this.
    return _.map(array, function(value){
      return value[propertyName];
    });
  };

  // Calls the method named by methodName on each value in the list.
  // Note: you will nead to learn a bit about .apply to complete this.
  _.invoke = function(collection, functionOrKey, args) {

    var isFunction = typeof functionOrKey === "function";

    return _.map(collection, function(element, key){
      return (isFunction ? functionOrKey : element[functionOrKey]).apply(element, args);
    });

  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(previousValue, item) for each item. previousValue should be
  // the return value of the previous iterator call.
  //
  // You can pass in an initialValue that is passed to the first iterator
  // call. If initialValue is not explicitly passed in, it should default to the
  // first element in the collection.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(total, number){
  //     return total + number;
  //   }, 0); // should be 6
  _.reduce = function(collection, iterator, accumulator) {

    _.each(collection, function(element, key){
      accumulator = iterator(accumulator, element);
    });

    return accumulator;

  };

  // Determine if the array or object contains a given value (using `===`).
  _.contains = function(collection, target) {
    // TIP: Many iteration problems can be most easily expressed in
    // terms of reduce(). Here's a freebie to demonstrate!
    return _.reduce(collection, function(wasFound, item) {
      // if (wasFound) {
      //   return true;
      // }
      return wasFound || item === target;
    }, false);
  };


  // Determine whether all of the elements match a truth test.
  _.every = function(collection, iterator) {
    // TIP: Try re-using reduce() here.

    var isFunction = typeof iterator === "function";

    return _.reduce(collection, function(trueSoFar, item) {
      return !!trueSoFar && !!(isFunction ? iterator(item) : item);
    }, true);

  };

  // Determine whether any of the elements pass a truth test. If no iterator is
  // provided, provide a default one
  _.some = function(collection, iterator) {
    // TIP: There's a very clever way to re-use every() here.

    var isFunction = typeof iterator === "function";

    var inverseIterator = function(element){
      return isFunction? !iterator(element) : !element;
    }

    return !_.every(collection, inverseIterator);

  };


  /**
   * OBJECTS
   * =======
   *
   * In this section, we'll look at a couple of helpers for merging objects.
   */

  // Extend a given object with all the properties of the passed in
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  _.extend = function(obj) {

    var args = [];
    for (var i = 1; i< arguments.length; i++){
      args.push(arguments[i]);
    }
    //I'm still looking for a better way to create an arguments array that is bullet-proof.

    _.each(args, function(object1){
      _.each(object1, function(element, key){
        obj[key] = element;
      });
    });

    return obj;

  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  _.defaults = function(obj) {
    var args = [];
    for (var i = 1; i< arguments.length; i++){
      args.push(arguments[i]);
    }
    //I'm still looking for a better way to create an arguments array that is bullet-proof.

    _.each(args, function(object1){
      _.each(object1, function(element, key){
        if(obj[key] === undefined){
          obj[key] = element;
        }
      });
    });

    return obj;
  };


  /**
   * FUNCTIONS
   * =========
   *
   * Now we're getting into function decorators, which take in any function
   * and return out a new version of the function that works somewhat differently
   */

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  _.once = function(func) {
    // TIP: These variables are stored in a "closure scope" (worth researching),
    // so that they'll remain available to the newly-generated function every
    // time it's called.
    var alreadyCalled = false;
    var result;

    // TIP: We'll return a new function that delegates to the old one, but only
    // if it hasn't been called before.
    return function() {
      if (!alreadyCalled) {
        // TIP: .apply(this, arguments) is the standard way to pass on all of the
        // infromation from one function call to another.
        result = func.apply(this, arguments);
        alreadyCalled = true;
      }
      // The new function always returns the originally computed result.
      return result;
    };
  };

  // Memoize an expensive function by storing its results. You may assume
  // that the function takes only one argument and that it is a primitive.
  //
  // _.memoize should return a function that when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  _.memoize = function(func) {
    var memo = {};

    return function() {
      
      //till I can find a better way to generate keys from arguments, I'm using JSON
      var key = JSON.stringify.apply(this, arguments);
      if(memo[key] !== undefined){
        return memo[key]
      } else {
        return (memo[key] = func.apply(this, arguments))
      }
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  _.delay = function(func, wait) {
    var args = [];
    for (var i = 2; i< arguments.length; i++){
      args.push(arguments[i]);
    }

    setTimeout(function(){
      func.apply(this, args);
    }, wait);
  };


  /**
   * ADVANCED COLLECTION OPERATIONS
   * ==============================
   */

  // Randomizes the order of an array's contents.
  //
  // TIP: This function's test suite will ask that you not modify the original
  // input array. For a tip on how to make a copy of an array, see:
  // http://mdn.io/Array.prototype.slice
  _.shuffle = function(array) {

    var index = 0;
    var shuffledArray = [];

    _.each(array, function(value) {
      var rand = Math.floor(Math.random() * index++);
      shuffledArray[index - 1] = shuffledArray[rand];
      shuffledArray[rand] = value;
    });
    return shuffledArray;
  };


  /**
   * Note: This is the end of the pre-course curriculum. Feel free to continue,
   * but nothing beyond here is required.
   */


  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  _.sortBy = function(collection, iterator) {

    var func = (typeof iterator === "function") ? iterator : function(a){
      return a[iterator];
    }

    var temp;

    for(var i = 0; i < collection.length; i++){
      for(var j = i+1; j < collection.length; j++){
        
        if( func(collection[i]) > func(collection[j]) || func(collection[i] === undefined)){
          temp = collection[i];
          collection[i] = collection[j];
          collection[j] = temp;
        }
      }
    }

    return collection;

  };

  // Zip together two or more arrays with elements of the same index
  // going together.
  //
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3], ['d',undefined]]
  _.zip = function() {
    var args = Array.prototype.slice.call(arguments);
    var length = 0;
    var result = [];

    _.each(args, function(array){
      if(array.length > length){
        length = array.length;
      }
    });

    for(var i = 0; i < length; i++) {
      var temporaryArray = [];
      _.each(args, function(array){
        temporaryArray.push(array[i]);
      });
      result.push(temporaryArray);
    }

    return result;
  };

  // Takes a multidimensional array and converts it to a one-dimensional array.
  // The new array should contain all elements of the multidimensional array.
  //
  // Hint: Use Array.isArray to check if something is an array
  _.flatten = function(nestedArray, result) {
    var isArray = Array.isArray(nestedArray);
    if(!isArray){
      return nestedArray;
    }

    var result = result || [];
    _.each(nestedArray, function(elem){
      if(Array.isArray(elem)){
        result.push(_.flatten(elem, result));
      } else {
        result.push(elem);
      }
    });

    //temporary fix till I can ascertain why extra circular elements are ending up in the result
    result = _.filter(result, function(elem){
      return !Array.isArray(elem);
    });

    return result;
  };

  // Takes an arbitrary number of arrays and produces an array that contains
  // every item shared between all the passed-in arrays.
  _.intersection = function() {
    var args = Array.prototype.slice.call(arguments);
    var firstArray = args.shift();

    return _.filter(firstArray, function(elem){
      return _.every(args, function(array){
        return _.indexOf(array, elem) !== -1;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var args = Array.prototype.slice.call(arguments);
    var firstArray = args.shift();

    return _.filter(firstArray, function(elem){
      return _.every(args, function(array){
        return _.indexOf(array, elem) === -1;
      });
    });
  };


  /**
   * MEGA EXTRA CREDIT
   * =================
   */

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  //
  // See the Underbar readme for details.
  _.throttle = function(func, wait) {
    var lastCalled = new Date("Jan 1, 1970");
    var lastReturnedValue = undefined;
    var pendingFunctions = 1;

    return function throttledFunction(){
      var timeNow = new Date();
      if(timeNow - lastCalled > wait){
        lastCalled = new Date();
        lastReturnedValue = func.call(this, arguments);
        return lastReturnedValue;
      } else {
        pendingFunctions ++;
        setTimeout(function(){
          throttledFunction.call(this, arguments);
          pendingFunctions --;
        }, wait);
        return lastReturnedValue;
      }
      //return lastReturnedValue;
    }
  };

}).call(this);
