module.exports = function routes(cityRegNum,) {

    //Display on screen
    async function index(req, res) {
        try {
            let plates = await cityRegNum.all();
            let myCity = await cityRegNum.cityAll();
            res.render('home', {
                plates,
                myCity
            });
        } catch (err) {
            console.error('Did not connect to database', err);
        }
    }
    async function diplayReg(req, res) {
        let city = req.body.towns;
        try {
            let myCity = await cityRegNum.cityAll();
            if (city === 'all') {
                let plates = await cityRegNum.all();
                res.render('home', {
                    plates: plates,
                    myCity:myCity,
                    'helpers': {
                        'selected': function () {
                            let currentCity = {};
                            currentCity.town_name = city;
                            currentCity.selected = 'selected';
                            console.log(currentCity);
                            return currentCity.selected;
                        }
                    }
                });
            } else {
                let plates = await cityRegNum.allFrom(city);
                res.render('home', {
                    plates,
                    myCity,
                    'helpers': {
                        'selected': function () {
                            let currentCity = {};
                            for(var i = 0; i < myCity.length; i++){
                                if(city === myCity[i].town_name){
                                    currentCity.town_name = myCity[i].town_name;
                                    break;
                                }
                            }
                            currentCity.selected = 'selected';
                            console.log(currentCity);
                            return currentCity.selected;    
                        }
                    }
                });
            }
        } catch (err) {
            console.error("Can not display what is in the database", err);
        }
    }
    //add reg to data base
    async function add(req, res) {
        let regNum = req.body.registration_number;
        try {
            await cityRegNum.add(regNum);
            res.redirect('/');
        } catch (err) {
            console.error('Can not add to the database', err);
        }
    }

    //functions to use
    return {
        index,
        diplayReg,
        add
    }
}