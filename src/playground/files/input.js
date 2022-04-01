function hi() {
  console.log('Hello World!');
  function xd() {
    console.log('siema eniu');
    (() => {
      const trapper = 2137 + 3;
      console.log(trapper);
      console.log('siema byku');
    })();
  }
  xd();
}
console.log('A to jest pierwszy call w Polsce');
hi();
const trapper = {
  swag: 100,
  mordo: 'weź',
  policja: 990 + 7,
  ['jago dzianki']: 'no  no',
};
console.log(trapper);
(function () {
  var foo = function () {
    console.log('abc');
  };
  var bar = function () {
    console.log('def');
  };
  var baz = function () {
    console.log('ghi');
  };
  var bark = function () {
    console.log('jkl');
  };
  var hawk = function () {
    console.log('mno');
  };
  var T = 'veryveryveryveryveryveryveryveryveryverylongstring';
  foo();
  bar();
  baz();
  bark();
  hawk();
})();
(function () {
  function foo() {
    return function () {
      var sum = 1 + 2;
      console.log(1);
      console.log(2);
      console.log(3);
      console.log(4);
      console.log(5);
      console.log(6);
    };
  }
  foo()();
})();
