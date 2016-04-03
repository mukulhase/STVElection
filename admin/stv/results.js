
var S = Big(B.length);
var t = Big(S).div((N+1)).plus(1).round(0,0);       // equivalent to Math.floor(stuff)..
var count = {};


function printB() {
    for(var i=0; i<B.length;i++) {
        console.log(B[i]);
    }
}

function initDS() {
    Big.DP = 40;        // The maximum number of decimal places of the results of operations involving division.

    for(i in CandidateMap) {          // Init count to zero
        count[i] = Big(0);
        // createCandidate(i,CandidateMap[i]);
    }
    for (var i=0;i<B.length;i++) {      //Initial Counting
        count[B[i][0]] = (count[B[i][0]]).plus(1.0);
    }
}


function NextTopCand(dict) {
    var key, val = Big(-1);
    for(i in dict) {
        if ((dict[i]).gte(val)) {
            val = dict[i];
            key = i;
        }
    }
    return key;
}

function NextBottomCand(dict) {
    var key, val = Big(9999999);
    for(i in dict) {
        if ((dict[i]).lt(val)) {
            val = dict[i];
            key = i;
        }
    }
    return key;
}


//Function to Transfer votes from Ci, who got k >= t votes, and was qualified to the delegation.
function TransferDown(c, k) {
    var f = (Big(k).sub(t)).div(k);      // Fraction to transfer - The higher the precision, the better it is :)
    for(var i=0; i<B.length;i++) {
        if(B[i][0] == c) {
            B[i].shift();
            if (B[i].length)    // Vote queue becomes empty after last candidate.
                count[B[i][0]] = count[B[i][0]].plus(f);
        }
    }
}


//Function to Transfer votes from 𝕔i, who got least votes in a stage, and was eliminated.
function TransferUp(c) {
    for(var i=0; i<B.length;i++) {
        if(B[i][0] == c) {
            B[i].shift();
            if (B[i].length)    // Vote queue becomes empty after last candidate.
                count[B[i][0]] = count[B[i][0]].plus(1.0);
        }
    }
}

function removeTrace(cand) {
    delete(count[cand]);                    // Remove from count dict
    for(var i=0; i<B.length; i++) {          // Remove his trace from voteQueues
        var ind = B[i].indexOf(parseInt(cand));
        if (ind == -1)
            continue;
        B[i].splice(ind, 1);
    }
}

function Qualify(TopCand) {
    console.log('Winner:',TopCand);
}

function Looser(LastCand) {
    console.log('Looser:',LastCand);
    // frontRemove(LastCand);
}


function calcResult() {         // Delegation Determination
    var n=0, TopCand, MaxVotes;
    while(n < N) {
        TopCand = NextTopCand(count);
        MaxVotes = count[TopCand];
        // updateStatus('Next Candidate is: ', CandidateMap[TopCand], 'with',MaxVotes);
        if( MaxVotes.gte(t)) {
            Qualify(TopCand);
            TransferDown(TopCand, MaxVotes);
            n += 1;
        } else {
            // Get the bottom candidate as Top :P
            TopCand = NextBottomCand(count);
            Looser(TopCand);
            TransferUp(TopCand);
        }
        removeTrace(TopCand);
    }
}
initDS();
calcResult();