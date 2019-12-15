const gerador = require('../lib/gerador')
const Param = require('../models/param')
const fs = require('fs-extra')
const app = require('../package.json')

const NAME_APP = app.name
const PATH_TEST = 'test/' + NAME_APP

let git = {}

describe('test foo', () => {

    beforeEach(() => {

        fs.mkdirSync(PATH_TEST)
        git = require('simple-git')(PATH_TEST)
        git.init()
    })

    it('test one', () => {

        const params = new Param({
            diretorio: "/home/foo/Documents",
            autor: "diegomdrs",
            projeto: ["foo-estatico", "foo-api"],
            task: ["1111111"]
        })

        gerador(params)
    })

    afterEach(() => {

        // fs.removeSync(PATH_TEST)
    })
})