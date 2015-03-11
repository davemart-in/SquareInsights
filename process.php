<?php
// GPLv2 License - Copyright (c) 2014 Dave Martin

// Check for answer
if ( $_POST && '' != $_POST['si_q'] ) {
	// Implode checkbox options
	if (is_array($_POST['si_q'])) {
		$_POST['si_q'] = implode(',', $_POST['si_q']);
	}
	// Save answer to answers.log
	log_it( $_POST['si_q'] );
}
function log_it( $text ) {
	$filename = 'answers.log';
	
	$fp = fopen($filename, 'a+');
	if ( $fp ) {
		// Save Date, IP address and answer 
		// in tab delimited format (makes it easy to paste into a spreadsheet)
		fwrite($fp, date("M j y") . "\t" . $_SERVER['REMOTE_ADDR'] . "\t$text\n");
		fclose($fp);
	}
}