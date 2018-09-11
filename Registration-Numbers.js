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
        let tag = regNum.substring(0,2);
        if(await checkTag(tag) && await checkReg(regNum)){
            let fId = await getID(tag);
            results = await pool.query('insert into plates(reg_number, towns_id) values($1, $2)', [regNum, fId.id]);
        }else{
            results = null;
        }
        return results;
    }
    async function getID(tagInfo){
        let results = await pool.query('select id from towns where town_code = $1', [tagInfo]);
        return results.rows[0];
    }
    async function checkTag(tagInfo){
        let results = await pool.query('select town_code from towns where town_code = $1', [tagInfo]);
        if(results.rows.length > 0){ 
            return true;}
            else{ 
                return false;
            }
    }
    async function checkReg(regNum){
        let results = await pool.query('select reg_number from plates where reg_number = $1', [regNum]);
        if(results.rows.length > 0){
            return false;
        }else{
            return true;
        }
    }
    return{
        all, 
        allFrom,
        add, 
        cityAll,
        checkReg,
        checkTag
    }
}