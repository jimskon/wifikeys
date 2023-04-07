
var option;
var pct_sfx = Array("00", "10", "20", "30", "40", "50", "60", "70", "80", "90");
var steps = 25;
var pcount=0;
var pplist=[];

$(document).ready(function () {
    option="One Key";
    $('#single').addClass('show');
    $("#gen-btn").click(genKey);
    $("#gen-keys-btn").click(startGenKeys);
    $("#gen-pp-btn").click(genRandomPP);
    $("#gen-file-btn").click(genPMKFile);

    $(".dropdown-menu a").click(function(){
	$(this).parents(".dropdown").find(".selection").text($(this).text());
	option=$(this).text();
	if (option=="One Key") {
	    $('#single').addClass('show');
	    $('#keylist').removeClass('show');

	}
	if (option=="Many Keys") {
	    $('#single').removeClass('show');
	    $('#keylist').addClass('show');

	}
    });
});

function status_cb(done) {
    var progress = '';

    for (var i = 0; i < steps; i++) {
        progress += '<span style="width: 5px; background: ';
        if (done - 1.5 > (i * 100.0) / steps) {
            progress += '#11b6f3;';
        } else {
            progress += '#d0fcca;';
        }
        progress += '">&nbsp</span>\n';
    }

    print_progress(progress);
}

function status_cb2(done) {
    var progress = '';

    for (var i = 0; i < steps; i++) {
        progress += '<span style="width: 5px; background: ';
        if (done - 1.5 > (i * 100.0) / steps) {
            progress += '#11b6f3;';
        } else {
            progress += '#d0fcca;';
        }
        progress += '">&nbsp</span>\n';
    }

    print_progress2(progress);
}

function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}

function print_error(mess) {
    $('#errormess').empty();
    $('#errormess').append(mess);
}

function clear_error() {
    $('#errormess').empty();
}

function print_progress(prog) {
    $('#hexkey').empty();
    $('#hexkey').append(prog);
}
function print_progress2(prog) {
    $('#progress').empty();
    $('#progress').append(prog);
}

function print_psk(key) {
    $('#hexkey').empty();
    $('#hexkey').append(key);
    b64=hexToBase64(key);
    $('#textkey').empty();
    $('#textkey').append(b64);
}

function add_psk(key) {
    b64=hexToBase64(key);
    $('#pmks').append(b64+"\n");
    $('#pmkshex').append(key+"\n");
    if (pcount<pplist.length) {
	genKeys();
    }	
}    

function gen_psk(passphrase,ssid) {
	// Sanity checks
	if (!passphrase || !ssid)
		return print_error('<i>Please fill in both values</i>');

	var pskgen = new PBKDF2(passphrase, ssid, 4096, 256 / 8);
    pskgen.deriveKey(status_cb, print_psk);
}

function gen_psk2(passphrase,ssid) {
	// Sanity checks
	if (!passphrase || !ssid)
		return print_error('<i>Please fill in both values</i>');

        var pskgen = new PBKDF2(passphrase, ssid, 4096, 256 / 8);
	pskgen.deriveKey(status_cb2, add_psk);
}

function genKey(){
    clear_error();
    var PassPhrase=$('#passphrase').val();
    var SSID=$('#SSID').val();
    gen_psk(PassPhrase,SSID);
}

function genKeys(){
    clear_error();
    var SSID=$('#SSID2').val();
    $('#count').text((pcount+1)+". ");
    gen_psk2(pplist[pcount++],SSID);
    
}
function startGenKeys() {
    $('#pmks').empty();
    pcount=0;
    var PassPhrases=$('#passphrases').val();
    pplist=PassPhrases.split('\n');
    genKeys();

}

// declare all characters
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
function genRandomPP() {
    numToCreate=$('#num_to_create').val();
    lenToCreate=$('#len_to_create').val();
    if (isNaN(numToCreate) || isNaN(lenToCreate)) {
	print_error('<i>Both values must be integers</i>');
	return;
    }
    $('#passphrases').empty();
    for (var i=0;i<numToCreate;i++) {
	key=generateString(lenToCreate).trim();
	$('#passphrases').append(key+"\n");
	
    }
    return;
}

function genPMKFile() {
    var vlanStart=$('#start_vid').val();
    console.log("GenPMKFiole: "+vlanStart);
    if (isNaN(vlanStart)) {
	print_error('<i>VLAN ID must be integer</i>');
	return;
    }
    
    var PassPhrases=$('#passphrases').val();
    var pplist=PassPhrases.split('\n');
    var PMKs=$('#pmks').val();
    var pmklist=PMKs.split('\n');
    var SSID=$('#SSID2').val();

    $('#pmkfile').append("# SSID: "+SSID+'\n');

    for (var i=0; i<pplist.length; i++) {
	$('#pmkfile').append("# "+pplist[i]+'\n');
	$('#pmkfile').append("vlanid="+vlanStart+" pmk="+pmklist[i]+'\n');
	vlanStart++;
    }
}
	


