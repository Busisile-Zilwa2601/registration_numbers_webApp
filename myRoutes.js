module.exports = function routes(cityRegNum) {
    //Display on screen
    async function index(req, res) {
        try {
            let plates = await cityRegNum.all();
            let myCity = await cityRegNum.cityAll();
            req.flash('info', ' ');
            res.render('home', {
                plates,
                myCity
            });
        } catch (err) {
            console.error('Did not connect to database', err);
        }
    }
    //diplay on town selected
    async function displayReg(req, res) {
        let city = req.body.towns;
        console.log(city);
        try {
            let myCity = await cityRegNum.cityAll();
            console.log(myCity);
            if (city === 'all') {
                let plates = await cityRegNum.all();
                res.render('home', {
                    plates: plates,
                    myCity: myCity
                });
            } else {
                let plates = await cityRegNum.allFrom(city);
                res.render('home', {
                    plates,
                    selected: selected(city, myCity),
                    myCity

                });
            }
        } catch (err) {
            console.error("Can not display what is in the database", err);
        }
    }
    //add reg to data base
    async function add(req, res, next) {
        let regNum = req.body.registration_number;
        if (regNum !== '') {
            if (regValidate(regNum)) {
                if (await cityRegNum.checkReg(regNum) && await cityRegNum.checkTag(regNum)){
                    try {
                        await cityRegNum.add(regNum);
                        // req.flash('info', regNum + ' Added');
                        res.redirect('/');
                    } catch (err) {
                        console.error('Can not add to the database', err);
                    }
                }else if(await cityRegNum.checkTag(regNum)){
                    req.flash('info', regNum + ' already exist in the database ');
                    res.redirect('/');
                }else if(await cityRegNum.checkReg(regNum)){
                    req.flash('info', regNum + ' Does not belong with a town in the database');
                    res.redirect('/');
                }
            } else {
                req.flash('info', ' Invalid pattern');
                res.redirect('/');
            }
        } else {
            req.flash('info', ' Please enter a vehicle number plate');
            res.redirect('/');
        }

    }
    //validate
    var regValidate = function (registration_number) {
        var regex = /^[a-zA-Z]{2,3}(\s)(?:([0-9]{3}(\-)[0-9]{3})|([0-9]{3,5}))$/;
        return regex.test(registration_number.toUpperCase());
    }
    //helper
    function selected(city, myCity) {
        let currentCity = {};
        for (let i = 0; i < myCity.length; i++) {
            if (city === myCity[i].town_name) {
                currentCity = myCity[i];
                currentCity.selected = 'selected';
                break;
            }
        }
        console.log(currentCity);
        return currentCity.selected;
    }
    //add a town to the table towns
    async function addCity(req, res) {
        let tag = req.body.code;
        let cityAdded = req.body.add_town;
        if(tag !=='' && cityAdded !==''){
            try {
                if(await cityRegNum.checkTown(cityAdded.toUpperCase())){
                    await cityRegNum.addTown(cityAdded, tag);
                    await cityRegNum.cityAll();
                    req.flash('info', cityAdded+' has been added');
                    res.redirect('/');    
                }else{
                    req.flash('info', cityAdded+' already exist');
                    res.redirect('/');
                }   
            } catch (err) {
                console.error('error accessing database', err);
            }
        }else{
            req.flash('info', ' Please anter a City Name and a City Registration Number Code');
            res.redirect('/');
        }
        
    }
    //Delete all registration plates
    async function deleteAll(req, res){
        try{
            await cityRegNum.deleteAllReg();
            req.flash('info', 'All registration numbers have been deleted on the database');
            res.redirect('/');
        }catch(err){
            console.error('Plates not deleted from database', err);
        }    
    }
    async function deleteTown(req, res){
        let townName = req.body.dtown;
        console.log(townName);
        try{
            await cityRegNum.deleteMyTown(townName);
            req.flash('info', townName +' has been deleted from database');
            res.redirect('/');
        }catch(err){
            console.error('Err deleting a town from database', err);
        }
    }
    //functions to use
    return {
        index,
        displayReg,
        add,
        addCity,
        deleteAll, 
        deleteTown
    }
}
//new helper.SafeString('selected = "'+ currentCity.selected +'"');