// Like underscore's bind, except it runs a function
// with no arguments off of an object.
//
//     var map = ...;
//     w(map).melt(myFunction);
//
// is equivalent to
//
//     var map = ...;
//     myFunction(map);
//
var w = function(self) {
    self.melt = function(func, obj) {
        return func.apply(obj, [self, obj]);
    };
    return self;
};
