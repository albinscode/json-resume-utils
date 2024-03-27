"use strict"
import * as fs from 'fs'
import * as csv from 'fast-csv'
import { Command } from 'commander'
import { render, cli } from 'resumed'

// the aim is to create  project experiences in json as described by json-resume


// global variables
let all = []
let current = {}
let inputJsonResumeFile

// LINES shall appear in this order
const COLUMN_PERIODE = "Période"
const COLUMN_ENTREPRISE = "Entreprise"
const COLUMN_PROJET = "Projet"
const COLUMN_FONCTION = "Fonction"
const COLUMN_MISSIONS =  'Missions et Réalisations'
const COLUMN_TECHNO =  'Environnements Technologiques'

const FIRST_LINE = COLUMN_PERIODE
const LAST_LINE = COLUMN_TECHNO

function manageRow(row) {
    console.log('Processing row')
    console.log(row)
    if (row.length != 2) {
        throw new Error(`row ${row} shall have two columns!`)
    }
    if (row[1].trim() == '') {
        throw new Error(`row ${row} shall be valued!`)
    }
    let firstColumn = row[0]
    let secondColumn = row[1]
    // we start a new project
    if (firstColumn == '') {
        current = {}
        console.log('new project')
    }
    else if (firstColumn == FIRST_LINE) {
        let period = secondColumn.split('-')
        current.startDate = period[0]
        if (period.length == 2) {
            current.endDate = period[1]
        }
        else {
            current.endDate = current.startDate
        }
    }
    else if (firstColumn == COLUMN_ENTREPRISE) {
        current.name = secondColumn
    }
    else if (firstColumn == COLUMN_PROJET) {
        current.summary = secondColumn
    }
    else if (firstColumn == COLUMN_FONCTION) {
        current.roles = secondColumn.split(',').map(d => d.trim())
    }
    else if (firstColumn == COLUMN_MISSIONS) {
        current.summary = current.summary + '\n' + secondColumn
    }
    // technos
    else if (firstColumn == LAST_LINE) {
        current.keywords = secondColumn.split(/[,\n]/).map(d => d.trim())
        // we push the full object and reset it
        all.push(current)
        console.log(current)
        current = {}
    }
}

function generateJson(rowCount, number) {
    console.log(`Parsed ${rowCount} rows`)
    console.log("Resulting Json")
    console.log(all)
    if (inputJsonResumeFile) {
        const outputJsonResumeFile = inputJsonResumeFile + '.new'
        console.log(`Adding experiences to ${outputJsonResumeFile}`)
        let json = {
            projects: []
        }
        if (fs.existsSync(inputJsonResumeFile)) {
            const content = fs.readFileSync(inputJsonResumeFile, { encoding: 'utf8', flag: 'r' })
            json = JSON.parse(content)
        }
        json.projects = all
        // reformat json string with a tab space of 2
        const jsonString = JSON.stringify(json, null, 2)
        fs.writeFileSync(outputJsonResumeFile, jsonString, { encoding: 'utf8' })
        // TODO fast render and validation using resumed?
        // render(outputJsonResumeFile)
        // cli.options = []
        // render()
    }
}

function processArguments() {

    const program = new Command()

    program
        .name('json-resume-utils')
        .description('CLI to help generate curriculum with json-resume')
        .version('1.0.0');

    program.command('xp')
        .description('Split a string into substrings and display as an array')
        .argument('<csvFile>', 'input csv file with experiences')
        .option('-i, --inputJsonResumeFile <input>', 'replaces experiences into given json resume file, a new file will be generated with a .new suffix')
        .action((csvFile, options) => {
            inputJsonResumeFile = options.inputJsonResumeFile
            importExperiencesFromCsvFile(csvFile)
    });

    program.parse();

}

async function importExperiencesFromCsvFile(filename) {

    fs.createReadStream(filename)
        .pipe(csv.parse({ headers: false, trim: true, delimiter: ',' }))
        .on('error', error => console.error(error))
        .on('data', row => manageRow(row))
        .on('end', (rowCount, number) => generateJson(rowCount, number))
}

processArguments()
