(function(){

//  /outfits/menu-list.js

    var list = {

        "Outfit": {

            "Sex": [
                ["Male", "/gender/male"],
                ["Female", "/gender/female"],
            ],

            "Actions": [
                ["Idle", "/action/idle"],
                ["Walk", "/action/walk"],
                ["Run",  "/action/run"],
                ["Jump", "/action/jump"],
            ],

            "Controls": [
                ["Left",  "/turn/left"],
                ["Back",  "/turn/back"],
                ["Right", "/turn/right"],
                ["Front", "/turn/front"],
            ],

            "Outfit": [
                ["Hairs", "/outfit/hairs"],
                ["Stockings", "/outfit/hairs"],
                ["Underwears", "/outfit/underwears"],
                ["Costume", "/outfit/costume"],
                ["Tshirt", "/outfit/tshirt"],
                ["Trousers", "/outfit/trousers"],
                ["Dress", "/outfit/dress"],
                ["Shoes", "/outfit/shoes"],
            ],

        /*
            "Users": [
                ["Login", "/user/login"],
                ["Signup", "/user/signup"],
                ["Logout", "/user/logout"],
            ],
        */

        },
    };

    var pages = {};
    for ( var section in list ) {
        pages[ section ] = {};
        for ( var category in list[ section ] ) {
            pages[ section ][ category ] = {};
            for ( var i = 0; i < list[ section ][ category ].length; i ++ ) {
                var page = list[ section ][ category ][ i ];
                pages[ section ][ category ][ page[ 0 ] ] = page[ 1 ];
            }
        }
    }

    
//  /outfits/menu-panel.js

    var panel = document.getElementById( "panel" );
    var viewer = document.getElementById( "viewer" );
    var expandButton = document.getElementById( "expandButton" );

    expandButton.addEventListener( "click", function ( event ) {
        panel.classList.toggle( "collapsed" );
        event.preventDefault();
    });

    var filterInput = document.getElementById( "filterInput" );
    var clearFilterButton = document.getElementById( "clearFilterButton" );
    var DELIMITER = "/";
    var MEMBER_DELIMITER = ".";
    var nameCategoryMap = {};
    var sections = [];

    var content = document.getElementById( "content" );

    function layoutList() {
        sections.forEach( function( el ) {
            var collapsed = true;
            Array.prototype.slice.apply( el.children ).forEach( function( item ) {
                if ( !item.classList.contains( "filtered" ) ) {
                    collapsed = false;
                    return;
                }
            });
            if ( collapsed ) {
                el.parentElement.classList.add( "filtered" );
            } else {
                el.parentElement.classList.remove( "filtered" );
            }
        } );
    }

    filterInput.addEventListener( "input", function( e ) {
        updateFilter();
    });

    clearFilterButton.addEventListener( "click", function( e ) {
        filterInput.value = "";
        updateFilter();
        e.preventDefault();
    });

    function updateFilter() {
        var exp = new RegExp( filterInput.value, "gi" );
        for( var j in nameCategoryMap ) {
            var res = nameCategoryMap[ j ].name.match( exp );
            if( res && res.length > 0 ) {
                nameCategoryMap[ j ].element.parentElement.classList.remove( "filtered" );
                var str = nameCategoryMap[ j ].name;
                for( var i = 0; i < res.length; i++ ) {
                    str = str.replace( res[ i ], "<b>" + res[ i ] + "</b>" );
                }
                nameCategoryMap[ j ].element.innerHTML = str;
            } else {
                nameCategoryMap[ j ].element.parentElement.classList.add( "filtered" );
                nameCategoryMap[ j ].element.textContent = nameCategoryMap[ j ].name;
            }
        }
        layoutList();
    }

    function encodeUrl( path ) {
        return path.replace(/\ \/\ /g, ".").replace(/\ /g, "_");
    }

    function decodeUrl( path ) {
        return path.replace(/_/g, " ").replace(/\./g, " / ");
    }

    function goTo( section, category, name, member ) {

        var parts, location;

    //  Fully resolve links that only provide a name.
        if (arguments.length == 1) {
            //  Resolve links of the form "Class.member".
            if (section.indexOf(MEMBER_DELIMITER) !== -1) {
                parts = section.split(MEMBER_DELIMITER)
                section = parts[0];
                member = parts[1];
            }
            location = nameCategoryMap[section];
            if (!location) return;
            section = location.section;
            category = location.category;
            name = location.name;
        }

        var title = `sloothes - ${name}`;
        var url = encodeUrl(section) + DELIMITER + encodeUrl( category ) + DELIMITER + encodeUrl(name) + (!!member ? MEMBER_DELIMITER + encodeUrl(member) : "");

        window.location.hash = url;
        window.document.title = title;
        panel.classList.add( "collapsed" );
    }

    function goToHash() {
        var hash = window.location.hash.substring( 1 ).split(DELIMITER);
        var member = hash[2].split(MEMBER_DELIMITER)
        goTo( decodeUrl(hash[0]), decodeUrl(hash[1]), decodeUrl(member[0]), decodeUrl(member.length > 1 ? member[1] : '') );
    }

    function storeTo( section, category, name, value, member ) {

        var parts, location;

    //  Fully resolve links that only provide a name.
        if (arguments.length == 1) {
            //  Resolve links of the form "Class.member".
            if (section.indexOf(MEMBER_DELIMITER) !== -1) {
                parts = section.split(MEMBER_DELIMITER)
                section = parts[0];
                member = parts[1];
            }

            location = nameCategoryMap[section];
            if (!location) return;
            section = location.section;
            category = location.category;
            name = location.name;
            value = location.value;
        }

    //  var url = encodeUrl(section) + DELIMITER + encodeUrl( category ) + DELIMITER + encodeUrl(name) + (!!member ? MEMBER_DELIMITER + encodeUrl(member) : "");

        store( category, value );
        panel.classList.add( "collapsed" );
    }

    for ( var section in list ) {

        var h2 = document.createElement( "h2" );
        h2.textContent = section;
        content.appendChild( h2 );

        for ( var category in list[ section ] ) {
            var div = document.createElement( "div" );
            var h3 = document.createElement( "h3" );
            h3.textContent = category;
            div.appendChild( h3 );
            var ul = document.createElement( "ul" );
            ul.id = category.toLocaleLowerCase();
            div.appendChild( ul );

            for ( var i = 0; i < list[ section ][ category ].length; i ++ ) {
                var page = list[ section ][ category ][ i ];
                var li = document.createElement( "li" );
                li.id = "menu-item-" + page[0].toLocaleLowerCase();
                var a = document.createElement( "a" );
            //  a.setAttribute( "href", "#" );

                ( function( s, c, p, v ) {
                    a.addEventListener( "click", function( e ) {
                        storeTo( s, c, p, v );
                        e.preventDefault();
                    });
                })( section, category, page[ 0 ], page[ 1 ] );

                a.textContent = page[ 0 ];
                li.appendChild( a );
                ul.appendChild( li );

                nameCategoryMap[page[0]] = {
                    section: section,
                    category: category,
                    name: page[0],
                    value: page[1],
                    element: a,
                };

            }

            content.appendChild( div );
            sections.push( ul );
        }

    }

    panel.appendChild( content );

//  /outfits/index.js

    var viewer = document.getElementById( "viewer" );

    $(viewer.contentWindow).on("load", function(){

        MW = this.MW;
        THREE = this.THREE;
        scene = this.scene;
        camera = this.camera;
        renderer = this.renderer;
        localPlayer = this.localPlayer;
        cameraControls = this.cameraControls;
        keyInputControls = this.keyInputControls;

        var interval;
        var msec = 250;

        const Run   = nameCategoryMap["Run"];
        const Idle  = nameCategoryMap["Idle"];
        const Walk  = nameCategoryMap["Walk"];
        const Jump  = nameCategoryMap["Jump"];
        const Left  = nameCategoryMap["Left"];
        const Back  = nameCategoryMap["Back"];
        const Right = nameCategoryMap["Right"];
        const Front = nameCategoryMap["Front"];

        const Male = nameCategoryMap["Male"];
        const Female = nameCategoryMap["Female"];
        const Hairs = nameCategoryMap["Hairs"];
        const Stockings = nameCategoryMap["Stockings"];
        const Underwears = nameCategoryMap["Underwears"];
        const Costume = nameCategoryMap["Costume"];
        const Tshirt = nameCategoryMap["Tshirt"];
        const Trousers = nameCategoryMap["Trousers"];
        const Dress = nameCategoryMap["Dress"];
        const Shoes = nameCategoryMap["Shoes"];

        var Signal = signals.Signal;
        var actionClicked = new Signal();
        var menuItemClicked = new Signal();

        function isWalking(){
            return viewer.contentWindow.localPlayer.controller.isRunning && viewer.contentWindow.localPlayer.controller.isWalking; // danger!
        }

        function isRunning(){
            return viewer.contentWindow.localPlayer.controller.isRunning && !viewer.contentWindow.localPlayer.controller.isWalking; // danger!
        }

        function dispatchIdleAction(){
            actionClicked.dispatch("/action/idle");
        }

        function dispatchWalkAction(){
            if ( isWalking() ) 
                actionClicked.dispatch("/action/idle");
            else 
                actionClicked.dispatch("/action/walk");
        }

        function dispatchRunAction(){
            if ( isRunning() ) 
                actionClicked.dispatch("/action/idle");
            else 
                actionClicked.dispatch("/action/run");
        }

        function dispatchJumpAction(){
            $(Jump.element).off("click");
            actionClicked.dispatch("/action/jump");
        }

        $(viewer.contentWindow).on("load", function(){
            this.localPlayer.controller.addEventListener("endJumping", function(){
                $(Jump.element).on("click", dispatchJumpAction);
            });
        });

        actionClicked.add(function(data){

            if (window.socket){

                $(Run.element).off("click", dispatchRunAction);  
                $(Walk.element).off("click", dispatchWalkAction);  
                $(Idle.element).off("click", dispatchIdleAction);

                socket.publish(localPlayerChannel, data, function(err){
                    if (err) console.error(err);
                    $(Run.element).on("click", dispatchRunAction);
                    $(Walk.element).on("click", dispatchWalkAction);
                    $(Idle.element).on("click", dispatchIdleAction);
                });

            } else {

                viewer.contentWindow.localPlayerHandler(data);

            }

        });

        $(Run.element).on("click", dispatchRunAction);
        $(Walk.element).on("click", dispatchWalkAction);
        $(Idle.element).on("click", dispatchIdleAction);
        $(Jump.element).on("click", dispatchJumpAction);

        menuItemClicked.add(function(data){
            if ( window.socket ) 
                socket.publish(localPlayerChannel, data);
            else 
                viewer.contentWindow.localPlayerHandler(data);
        });

        $(Male.element).on("click", function(){
            clearTimeout(interval);
            interval = setTimeout(function(){
                menuItemClicked.dispatch("/gender/male");
            }, msec);
        });

        $(Female.element).on("click", function(){
            clearTimeout(interval);
            interval = setTimeout(function(){
                menuItemClicked.dispatch("/gender/female");
            }, msec);
        });

        $(Left.element).on("click", function (){
            menuItemClicked.dispatch("/turn/left");
        });

        $(Back.element).on("click", function (){
            menuItemClicked.dispatch("/turn/back");
        });

        $(Right.element).on("click", function (){
            menuItemClicked.dispatch("/turn/right");
        });

        $(Front.element).on("click", function (){
            menuItemClicked.dispatch("/turn/front");
        });

        $(Hairs.element).on("click", function (){
            clearTimeout(interval);
            interval = setTimeout(function(){
                menuItemClicked.dispatch("/outfit/hairs");
            }, msec);
        });

        $(Stockings.element).on("click", function (){
            clearTimeout(interval);
            interval = setTimeout(function(){
                menuItemClicked.dispatch("/outfit/stockings");
            }, msec);
        });

        $(Underwears.element).on("click", function (){
            clearTimeout(interval);
            interval = setTimeout(function(){
                menuItemClicked.dispatch("/outfit/underwears");
            }, msec);
        });

        $(Costume.element).on("click", function (){
            clearTimeout(interval);
            interval = setTimeout(function(){
                menuItemClicked.dispatch("/outfit/costume");
            }, msec);
        });

        $(Tshirt.element).on("click", function (){
            clearTimeout(interval);
            interval = setTimeout(function(){
                menuItemClicked.dispatch("/outfit/tshirt");
            }, msec);
        });

        $(Trousers.element).on("click", function (){
            clearTimeout(interval);
            interval = setTimeout(function(){
                menuItemClicked.dispatch("/outfit/trousers");
            }, msec);
        });

        $(Dress.element).on("click", function (){
            clearTimeout(interval);
            interval = setTimeout(function(){
                menuItemClicked.dispatch("/outfit/dress");
            }, msec);
        });

        $(Shoes.element).on("click", function (){
            clearTimeout(interval);
            interval = setTimeout(function(){
                menuItemClicked.dispatch("/outfit/shoes");
            }, msec);
        });

    });

})();
