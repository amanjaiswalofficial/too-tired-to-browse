// Contain all model related operations
// Library imports
const path = require('path')
const { Sequelize, DataTypes } = require("sequelize");
const sqlite3 = require('sqlite3').verbose();

// Definitions
class DataModel
{

    constructor()
    {

        const dbPath = path.resolve(__dirname, './data.db')

        // look for database, and if doesn't exist, make one
        new sqlite3.Database(dbPath, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
                console.error(err.message);
            }
        });

        // connect to the db file
        this.sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: dbPath
        });

    }

    defineSchema = (sequelizeInstance) => {

        return sequelizeInstance.define('Item', {

            searchStrings: {
                type: DataTypes.STRING,
            },
            fileName:{
                type: DataTypes.STRING
            },
            data: {
                type: DataTypes.STRING
            }
        });
    }

    syncSchema = async (schemaInstance) => {

        await schemaInstance.sync()
    
    }

    insertItem = async (schemaInstance, fileName, searchStrings, data) => {
    
        this.syncSchema(schemaInstance)
        values = [4,5,6]
        await schemaInstance.create({
            searchStrings: JSON.stringify(searchStrings), 
            fileName: fileName, 
            data: JSON.stringify(data)
      })  

    }

    getAllItems = async (schemaInstance) => {

        try{
            const allItems = await schemaInstance.findAll()
            allItems.forEach(item => {
                item.data = JSON.parse(item.data)
                item.searchStrings = JSON.parse(item.searchStrings)
            })
            return allItems
            // console.log(JSON.parse(allItems[1].data))
            // console.log(JSON.parse(allItems[1].searchStrings))
        }
        catch(err){
            console.log(err)
        }
    }
    
    closeSequelize = async (sequelizeInstance) => {

        sequelizeInstance.close()
    
    }

    testConnection = async (sequelizeInstance) => {
        try 
        {
            await sequelizeInstance.authenticate();
                console.log('Connection has been established successfully.');
          } catch (error) {
                console.error('Unable to connect to the database:', error);
            }
        }
}

exports.DataModel = DataModel