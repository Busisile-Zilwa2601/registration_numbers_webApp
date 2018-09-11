const assert = require('assert');
const reg_numbers = require('../Registration-Numbers');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgres://busisile:pg123@localhost/registration_numbers';

const pool = new Pool({
    connectionString
});


describe('The Registration-Numbers database webApp', function () {
    beforeEach(async function(){
        await pool.query('delete from plates;');
    });
    it('all in length: Should return the database length', async function(){
        let reg = reg_numbers(pool);
        await reg.add('CA 230');
        await reg.add('CY 930-897');
        await reg.add('CJ 230');
        await reg.add('CA 230');
        await reg.add('CL 980');
        let reg_numbs = await reg.all();
        assert.equal(reg_numbs.length, 4);
    });
    it('allFrom: Should return Cape Town registration numbers that are in the database', async function(){
        let reg = reg_numbers(pool);
        await reg.add('CA 230');
        await reg.add('CA 930-897');
        await reg.add('CJ 230');
        await reg.add('CA 980');
        let reg_numbs = await reg.allFrom('Cape Town');
        //console.log(JSON.stringify(reg_numbs));
        assert.deepEqual(reg_numbs, [{town_name:'Cape Town',reg_number:'CA 230'},{town_name:'Cape Town',reg_number:'CA 930-897'},{town_name:'Cape Town',reg_number:'CA 980'}]);
    });
    it('CheckTag: Should return False if the town_code is not in database', async function(){
        let reg = reg_numbers(pool);
        let reg_numbs = await reg.checkTag('CD');
        assert.equal(reg_numbs,false);
    });
    it('CheckTag: Should return True if the town_code is in database', async function(){
        let reg = reg_numbers(pool);
        let reg_numbs = await reg.checkTag('CY');
        assert.equal(reg_numbs, true);
    });
    it('CheckReg: Should return TRUE when registraion-number is not in the database, then it will be added', async function(){
        let reg = reg_numbers(pool);
        await reg.add('CA 230');
        await reg.add('CY 930-897');
        let reg_numbs = await reg.checkReg('CA 231');
        assert.equal(reg_numbs, true);
    });
    it('CheckReg: Should return FALSE when registraion-number is in the database, then it will not be added', async function(){
        let reg = reg_numbers(pool);
        await reg.add('CA 230');
        await reg.add('CY 930-897');
        let reg_numbs = await reg.checkReg('CA 230');
        assert.equal(reg_numbs, false);
    });
    
    after(function(){
        pool.end();
    })
});