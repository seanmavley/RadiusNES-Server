<?php
  $uamsecret = 'secret';
  $challenge = 'c731395aca5dcf45446c0ae83db5319e';
  $password = 'password';

  $hexchal = pack("H32", $challenge);
  $newchal = pack("H*", md5($hexchal.$uamsecret));
  $response = md5("\0".$password.$newchal);
  $newpwd = pack("a32", $password);
  $pappassword = implode("", unpack("H32", ($newpwd ^ $newchal)));

  echo "Hexchal: ---> ", $hexchal, "\n";
  echo "NewChal: ---> ", $newchal, "\n";
  echo "Response: ---> ", $response, "\n";  
  echo "NewPass: ---> ", $newpwd, "\n";  
?>  
