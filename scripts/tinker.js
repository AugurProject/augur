    function RageFest(inquiry) {
        this.inquiry = inquiry;
        this.otherObject = {
            myFunction6: function () {
                console.log(this.inquiry);
            }.bind(this)
        };
    }

RageFest.prototype.myFunction0 = function () {
    console.log(this.inquiry);
};

RageFest.prototype.myObject = {
    myFunction1: function () { console.log(this.inquiry); },
    myFunction2: function () { console.log(this.inquiry); }.bind(this),
    myFunction3: function () { console.log(this.inquiry); }.bind(RageFest)
};

var ragefest = new RageFest("you mad, bro?");

RageFest.prototype.myObject.myFunction4 = function () {
    console.log(this.inquiry);
}.bind(ragefest);

ragefest.myFunction0();

ragefest.myObject.myFunction1();
ragefest.myObject.myFunction2();
ragefest.myObject.myFunction3();

ragefest.myObject.myFunction4();

RageFest.prototype.myObjectConstructor = function () {
    this.answer = "nah bro";
};

RageFest.prototype.myObjectConstructor.prototype.myFunction5 = function () {
    console.log(this);
};

(new RageFest.prototype.myObjectConstructor()).myFunction5();

ragefest.otherObject.myFunction6();
