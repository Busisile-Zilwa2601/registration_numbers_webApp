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
        await reg.add('CA 230-009');
        await reg.add('CJ 230');
        await reg.add('CA 230');
        await reg.add('CL 98045');
        let reg_numbs = await reg.all();
        console.log(reg_numbs);
        assert.equal(reg_numbs.length, 4);
    });
    it('allFrom: Should return Cape Town registration numbers that are in the database', async function(){
        let reg = reg_numbers(pool);
        await reg.add('CA 230');
        await reg.add('CA 930-897');
        await reg.add('CJ 230');
        await reg.add('CA 980');
        let reg_numbs = await reg.allFrom('CAPE TOWN');
        //console.log(JSON.stringify(reg_numbs));
        assert.deepEqual(reg_numbs, [{town_name:'CAPE TOWN',reg_number:'CA 230'},{town_name:'CAPE TOWN',reg_number:'CA 930-897'},{town_name:'CAPE TOWN',reg_number:'CA 980'}]);
    });
    it('CheckTag: Should return False if the town_code is not in database', async function(){
        let reg = reg_numbers(pool);
        let reg_numbs = await reg.checkTag('CD');
        assert.equal(reg_numbs,false);
    });
    it('CheckTag: Should return True if the town_code is in database', async function(){
        let reg = reg_numbers(pool);
        let reg_numbs = await reg.checkTag('CL');
        assert.equal(reg_numbs, true);
    });
    it('CheckReg: Should return TRUE when registraion-number is not in the database', async function(){
        let reg = reg_numbers(pool);
        await reg.add('CA 230');
        await reg.add('CY 930-897');
        let reg_numbs = await reg.checkReg('CA 231');
        assert.equal(reg_numbs, true);
    });
    it('CheckReg: Should return FALSE when registraion-number is in the database', async function(){
        let reg = reg_numbers(pool);
        await reg.add('CA 230');
        await reg.add('CY 930-897');
        let reg_numbs = await reg.checkReg('CA 230');
        assert.equal(reg_numbs, false);
    });
    it('checkTown: Should return True when the City is the not in the database', async function(){
        let reg = reg_numbers(pool);
        let city = await reg.checkTown('WORCESTER');
        assert.equal(city, true);
    });
    it('checkTown: Should return False when the City is the in the database', async function(){
        let reg = reg_numbers(pool);
        let city = await reg.checkTown('CAPE TOWN');
        assert.equal(city, false);
    });
    it('addTown: Should add a the City when is the not in the database, then return True', async function(){
        let reg = reg_numbers(pool);
        let cityCape = await reg.addTown('CAPE TOWN', 'CA');
        assert.deepEqual(cityCape, false);
    });
    it('deleteAllReg: Should delete all registration numbers on the database', async function(){
        let reg = reg_numbers(pool);
        await reg.add('CA 230-009');
        await reg.add('CJ 230');
        await reg.add('CA 230');
        await reg.add('CL 98045');
        let reg_numbs = await reg.all();
        console.log(reg_numbs);
        await reg.deleteAllReg();
        console.log(await reg.all());
        assert.deepEqual(await reg.all(), []);
    });
    it('deleteMyTown: Should delete a City when is the in the database', async function(){
        let reg = reg_numbers(pool);
        await reg.deleteMyTown('GEORGE');
        let city = await reg.checkTown('GEORGE');
        assert.deepEqual(city, true);
    });
    after(function(){
        pool.end();
    })
});