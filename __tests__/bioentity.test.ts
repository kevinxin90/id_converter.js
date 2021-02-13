import { ValidBioEntity } from '../src/bioentity/valid_bioentity';
import { InValidBioEntity } from '../src/bioentity/invalid_bioentity';

const CDK2_DB_IDs = {
    "NCBIGene": ["1017"],
    "HGNC": ["1771"],
    "SYMBOL": ["CDK2"],
    "name": ["cyclin dependent kinase 2"],
}

const RILUZOLE_DB_IDS = {
    "CHEMBL.COMPOUND": ["CHEMBL744"],
    "name": ["Riluzole", "RILUZOLE"],
    "PUBCHEM": ["5070"],
}

const DB_ID_WITH_NO_PRIMARY = {
    kk: ["kkk"]
}

const DISEASE_DB_IDS = {
    "MONDO": ["MONDO:12345"]
}

const CHEMBL7512_DB_IDS = { "CHEMBL.COMPOUND": ["CHEMBL7512"], "PUBCHEM": ["53428"] }
describe("Test ValidBioEntity Class", () => {
    describe("Test getPrimaryID function", () => {
        test("db ids with prefixes defined in metadata should return the primary id", () => {
            const entity = new ValidBioEntity("Gene", CDK2_DB_IDs);
            const primary_id = entity.primaryID;
            expect(primary_id).toBe("NCBIGene:1017")
        })

        test("db ids always prefixed should return itself", () => {
            const entity = new ValidBioEntity("Disease", DISEASE_DB_IDS);
            const primary_id = entity.primaryID;
            expect(primary_id).toBe("MONDO:12345")
        })

        test("db ids without prefixes defined in metadata should return undefined", () => {
            const entity = new ValidBioEntity("Gene", DB_ID_WITH_NO_PRIMARY);
            const primary_id = entity.primaryID;
            expect(primary_id).toBeUndefined();
        })
    })

    describe("Test getLabel function", () => {
        test("if SYMBOL provided in db ids, should return symbol", () => {
            const entity = new ValidBioEntity("Gene", CDK2_DB_IDs);
            const label = entity.label;
            expect(label).toBe("CDK2");
        })

        test("if SYMBOL not provided in db ids and name is provided, should return name", () => {
            const entity = new ValidBioEntity("ChemicalSubstance", RILUZOLE_DB_IDS);
            const label = entity.label;
            expect(label).toBe("Riluzole");
        })

        test("if both SYMBOL and name are not provided in db ids, should return primary id", () => {
            const entity = new ValidBioEntity("ChemicalSubstance", CHEMBL7512_DB_IDS);
            const label = entity.label;
            expect(label).toBe("CHEMBL.COMPOUND:CHEMBL7512");
        })
    });

    describe("Test getCuries function", () => {
        test("test getCuries", () => {
            const entity = new ValidBioEntity("ChemicalSubstance", CHEMBL7512_DB_IDS);
            const curies = entity.curies;
            expect(curies).toContain("CHEMBL.COMPOUND:CHEMBL7512");
            expect(curies).toHaveLength(2);
        })

    })

    describe("Test getDBIDs function", () => {
        test("test getDBIDs", () => {
            const entity = new ValidBioEntity("ChemicalSubstance", CHEMBL7512_DB_IDS);
            const dbIDs = entity.dbIDs;
            expect(dbIDs).toEqual(CHEMBL7512_DB_IDS);
        })

    })

})

describe("Test InValidBioEntity Class", () => {
    describe("Test getPrimaryID function", () => {
        test("should return the input curie", () => {
            const entity = new InValidBioEntity("Gene", "KK:123");
            const primary_id = entity.primaryID;
            expect(primary_id).toBe("KK:123")
        })
    })

    describe("Test getLabel function", () => {
        test("should return the input curie", () => {
            const entity = new InValidBioEntity("Gene", "KK:123");
            const label = entity.label;
            expect(label).toBe("KK:123");
        })
    });

    describe("Test getCuries function", () => {
        test("test getCuries", () => {
            const entity = new InValidBioEntity("ChemicalSubstance", "KK:123");
            const curies = entity.curies;
            expect(curies).toEqual(["KK:123"]);
        })

    })

    describe("Test getDBIDs function", () => {
        test("test getDBIDs", () => {
            const entity = new InValidBioEntity("ChemicalSubstance", "KK:123");
            const dbIDs = entity.dbIDs;
            expect(dbIDs).toEqual(
                {
                    KK: ["123"]
                }
            );
        })

    })

})