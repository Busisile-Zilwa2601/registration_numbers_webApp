module.exports = function cityRegNum(pool){
 
    async function all(){
        let query = 'select towns.town_name, plates.reg_number as reg_number from towns join plates on towns.id = plates.towns_id';
        let results = await pool.query(query);
        return results.rows;
    }
    async function cityAll(){
        let results = await pool.query('select town_name from towns');
        return results.rows;
    }
    async function allFrom(city){
        let query = 'select towns.town_name, plates.reg_number as reg_number from towns join plates on towns.id = plates.towns_id where towns.town_name = $1';
        let results = await pool.query(query, [city]);
        return results.rows;
    }
    async function add(regNum){
        let results;
        let tag = regNum.substring(0,3).trim().toUpperCase();
        if(regNum.toUpperCase()){
            if(await checkTag(regNum.toUpperCase()) && await checkReg(regNum.toUpperCase())){
                let fId = await getID(tag);
                await pool.query('insert into plates(reg_number, towns_id) values($1, $2)', [regNum.toUpperCase(), fId.id]);
                results = true;
            }else{
                results = false;
            }
        }
        return results;
    }
    async function getID(tagInfo){
        let results = await pool.query('select id from towns where town_code = $1', [tagInfo.toUpperCase()]);
        return results.rows[0];
    }
    async function checkTag(regNum){
        let tagInfo = regNum.substring(0,3).trim().toUpperCase();
        let results = await pool.query('select town_code from towns where town_code = $1', [tagInfo.toUpperCase()]);
        if(results.rows.length > 0){ 
            return true;}
            else{ 
                return false;
            }
    }
    async function checkReg(regNum){
        let results = await pool.query('select reg_number from plates where reg_number = $1', [regNum.toUpperCase()]);
        if(results.rows.length > 0){
            return false;
        }else{
            return true;
        }
    }
    async function addTown(city, tag){
        if(await checkTown(city.toUpperCase())){
            await pool.query('INSERT INTO towns(town_name, town_code) values($1, $2)',[city.toUpperCase(), tag.toUpperCase()]);
            return true;
        }else{
            return false;
        }
    }
    async function checkTown(city){
        let results = await pool.query('select town_name from towns where town_name =$1', [city.toUpperCase()]);
        if(results.rows.length > 0){
           return false;     
        }else{
            return true;
        }
    }
    async function deleteAllReg(){
        await pool.query('delete from plates');
    }
    async function deleteMyTown(townName){
        await pool.query('delete from towns where town_name =$1', [townName]);
    }
    return{
        all, 
        allFrom,
        add, 
        cityAll,
        checkReg,
        checkTag,
        checkTown,
        addTown,
        deleteAllReg,
        deleteMyTown
    }
}