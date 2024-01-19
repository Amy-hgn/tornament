const mongoose = require ('mongoose')

const personSchema = mongoose.Schema(
    {
        //TODO Hier kommt die UUID aus SmartWE des nutzers rein
        personId: {
            type: String,
            required: [true, "Bitte die UUID angeben."]
        },
        name: {
            type: String,
            required: [true, "Bitte den Namen angeben."]
        },
    },
    {
        timestamps: true
    }
);

const teamSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Bitte den Teamnamen angeben."]
        },
        mitglieder: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Person'
            }],
        teamPlatzierungen: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Platzierung'
            }],
            teamGröße: {
                type: Number,
                default: 2
            },
    },
    {
        timestamps: true
    }
);

const spielSchema = mongoose.Schema(
    {    
        spielStatus: {
            type: String,
            enum: ['notStarted', 'ongoing', 'completed'],
            default: 'notStarted'
        },
        team1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        team2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        punkteGewinner: {
            type: Number,
            enum: [1, 2]
        },
        naechsteRunde: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Spiel'
        }
    },
    {
        timestamps: true
    }
);

const koRundeSchema = mongoose.Schema(
    {
        koSpiele: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Spiel',
        }],
        tiefe: {
            type: Number,
            required: true
        }  
    },
    {
        timestamps: true
    }
);

const platzierungSchema = mongoose.Schema(
    {
        platz: {
            type: Number,
            required: [true, "Bitte Platz eingeben"]
        },

    },
    {
        timestamps: true
    }
);

const turnierSchema = mongoose.Schema(
    {
        turnierMaster:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Person'
        },
        //quasi uuid aber damit nutzer via Nummer finden können
        turnierNummer: {
            type: Number,
            required: [true]
        },
        turnierName:{
            type: String,
            required: [true, "Bitte gebe den Turniernamen an."]
        },
        startDatum: {
            type: Date, 
            required: [true, "Bitte das Startdatum angeben."] 
        },
        endDatum: {
            type: Date, 
            required: [true, "Bitte das Enddatum angeben."] 
        },
        veranstaltungsort:{
            type: String,
            required: [true, "Bitte den Veranstaltungsort angeben."] 
        },
        beschreibung:{
            type: String,
            required: [true, "Bitte die Beschreibung angeben."] 
        },
        startZeit: {
            type: String, 
            required: [true, "Bitte die Startzeit angeben."]
        },
        kosten: {
            type: String,
            required: [true, "Bitte die Kosten angeben."]
        },
        turnierTeilnehmerAnzahl:{
            type: Number,
            required: [true, "Bitte Maximal Anzahl angeben"]
        },
        teilnehmer: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Person'
            }],
        turnierTeams: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Team'
                }
            ],
        turnierPlatzierungen: [ {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Platzierung'
            }],
        koRunden: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'KORunde'
                }
            ]

    },
    {
        timestamps:true
    }
)

teamSchema.virtual('personen', {
    ref: 'Person',
    localField: 'mitglieder',
    foreignField: '_id'
});
turnierSchema.virtual('personen', {
    ref: 'Person',
    localField: 'teilnehmer',
    foreignField: '_id'
});
turnierSchema.virtual('master', {
    ref: 'Person',
    localField: 'turnierMaster',
    foreignField: '_id'
});
spielSchema.virtual('teams', {
    ref: 'Team',
    localField: 'teilnehmerTeam',
    foreignField: '_id'
});

turnierSchema.virtual('teams', {
    ref: 'Team',
    localField: 'turnierTeams',
    foreignField: '_id'
});
koRundeSchema.virtual('spiele', {
    ref: 'Spiel',
    localField: 'koSpiele',
    foreignField: '_id'
});
teamSchema.virtual('platzierungen', {
    ref: 'Platzierung',
    localField: 'teamPlatzierungen',
    foreignField: '_id'
});

turnierSchema.virtual('platzierungen', {
    ref: 'Platzierung',
    localField: 'turnierPlatzierungen',
    foreignField: '_id'
});

const Person = mongoose.model('Person', personSchema);
const Team = mongoose.model('Team', teamSchema);
const Platzierung = mongoose.model('Platzierung', platzierungSchema);
const KoRunde = mongoose.model('KORunde', koRundeSchema);
const Spiel = mongoose.model('Spiel', spielSchema);
const Turnier = mongoose.model('Turnier', turnierSchema);

module.exports = {
    Person,
    Team,
    Platzierung,
    KoRunde,
    Spiel,
    Turnier,
};