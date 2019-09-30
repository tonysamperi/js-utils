/**
 *    paginateIt by Tony Samperi 2018
 */
(function ($) {

    var classNames = {
        disabled: "disabled",
        paginator: "paginator",
        paginatorPrev: "paginator-prev",
        paginatorNext: "paginator-next"
    };

    var style = "\
     div." + classNames.paginator + " {\
        display: block;\
        float: left;\
        width: 100%;\
        clear: both;\
     }\
     \
     div.paginator:after {\
        display: table;\
     }\
     \
     span." + classNames.paginatorPrev + ",\
     span." + classNames.paginatorNext + " {\
        cursor: pointer;\
        color: #18bc9c;\
        -webkit-user-select: none; /* Safari 3.1+ */\
        -moz-user-select: none; /* Firefox 2+ */\
        -ms-user-select: none; /* IE 10+ */\
        user-select: none; /* Standard syntax */\
     }\
     \
     span." + classNames.paginatorPrev + ":hover,\
     span." + classNames.paginatorNext + ":hover {\
        font-weight: bold;\
     }\
     \
     span." + classNames.paginatorPrev + "." + classNames.disabled + ",\
     span." + classNames.paginatorNext + "." + classNames.disabled + " {\
        color: #DDD;\
        cursor: default;\
     }\
     \
      span." + classNames.paginatorPrev + "." + classNames.disabled + ":hover,\
     span." + classNames.paginatorNext + "." + classNames.disabled + ":hover {\
        font-weight: initial;\
     }\
     \
    ";

    void 0 !== document && function (e, t) {
        var n = e.createElement("style");
        if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet) {
            n.styleSheet.disabled || (n.styleSheet.cssText = t);
        }
        else {
            try {
                n.innerHTML = t
            } catch (e) {
                n.innerText = t
            }
        }
    }(document, style);

// Object assign polyfill
    if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }

                var result = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) {
                        continue;
                    }
                    nextSource = Object(nextSource);

                    var keysArray = Object.keys(Object(nextSource));
                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                        var nextKey = keysArray[nextIndex];
                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (desc !== undefined && desc.enumerable) {
                            result[nextKey] = nextSource[nextKey];
                        }
                    }
                }
                return result;
            }
        });
    }

    var defaults = {
        count: 10,
        navBefore: false
    };

    $.paginateIt = function ($target, opts) {
        var self = this;
        this.fullData = $target.children().clone();
        this.visibleData = "";
        this.total = this.fullData.length;
        this.page = 1;
        this.count = opts.count;
        this.totalPages = Math.ceil(this.total / this.count);
        //PAGINATOR
        this.paginatorTemplate = "<div class='row paginator'>\
        <div class='col-lg-9 col-md-8 col-sm-7 col-xs-6'></div>\
            <div class='col-lg-3 col-md-4 col-sm-5 col-xs-6'> \
                <div class='pull-right'> \
                    <span title='previous-page' class='paginator-prev " + classNames.disabled + "'>&lt;&nbsp;</span>  \
                    <span>page</span> <span class='currentPage'></span> \
                    <span>&nbsp;of&nbsp;</span><span class='totalPages'></span> \
                    <span class='paginator-next'>&nbsp;&gt;</span> \
                </div> \
            </div> \
        </div>";
        var insertMethod = "insertAfter";
        if (opts.navBefore == "true") {
            insertMethod = "insertBefore";
        }
        $(this.paginatorTemplate)[insertMethod]($target);
        this.paginator = $target.next();
        this.pagCurrent = self.paginator.find(".currentPage");
        this.pagTotal = self.paginator.find(".totalPages");
        this.pagNext = self.paginator.find("." + classNames.paginatorNext);
        this.pagPrev = self.paginator.find("." + classNames.paginatorPrev);
        this.pagNext.on("click", function () {
            self.nav("next");
        });
        this.pagPrev.on("click", function () {
            self.nav("prev");
        });

        this.nav = function (action) {
            switch (action) {
                case "prev":
                    if (self.page > 1) {
                        self.page--;
                        self.visibleData = self.fullData.slice((self.page - 1) * self.count, self.page * self.count);
                        $target.empty().append(self.visibleData);
                        self.pagCurrent.text(self.page);
                        self.pagTotal.text(self.totalPages);
                    }
                    break;
                case "next":
                    if (self.page < self.totalPages) {
                        self.page++;
                        self.visibleData = self.fullData.slice((self.page - 1) * self.count, self.page * self.count);
                        $target.empty().append(self.visibleData);
                        self.pagCurrent.text(self.page);
                        self.pagTotal.text(self.totalPages);
                    }
                    break;
                case "boot":
                    self.visibleData = self.fullData.slice((self.page - 1) * self.count, self.page * self.count);
                    $target.empty().append(self.visibleData);
                    self.pagCurrent.text(self.page);
                    self.pagTotal.text(self.totalPages);
                    $target.find("img:last").on("load", function () {
                        $target.css("minHeight", $target.height());
                    });
                    break;
                default:
                    console.error("WRONG ACTION!");
                    break;
            }
            self.pagPrev.toggleClass(classNames.disabled, self.page === 1);
            self.pagNext.toggleClass(classNames.disabled, self.page === self.totalPages);
        };
        self.nav("boot");
    };

    $(document).ready(function () {
        $("[paginate]").each(function () {
            var opts = {};
            var paginateAttr = $(this).attr("paginate") * 1;
            var navAttr = $(this).attr("nav-before");
            if (isNaN(parseInt(paginateAttr))) {
                console.error("invalid \"paginate\" attribute at [paginate]", $(this));
            }
            else {
                opts.count = paginateAttr;
            }
            opts.navBefore = navAttr == "true";
            Object.assign({}, defaults, opts);
            return new $.paginateIt($(this), opts);
        });
    });
})(jQuery);
