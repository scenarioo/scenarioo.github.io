/**
 * Script for opening / triggering a contact email
 */
function sendContactEmail() {

	window.location=concatEmailAddress("con", "tact", "sce", "nar", "ioo.org");	

	function concatEmailAddress(n1, n2, d1, d2, d3) {
		return "mailto:" + n1 + n2 + "@" + d1 + d2 + d3;
	}

    return false;
}
