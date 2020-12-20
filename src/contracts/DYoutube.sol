pragma solidity ^0.5.0;

contract DYoutube {
  uint public videoCount = 0;
  string public name = "DYoutube";
// mapping to get video data by id
mapping(uint=>Video) public videos;
// 1.) modelling the video in a data structure
  //Create Struct
  struct Video{
    uint id;
    string hash;
    string title ;
    address author;
  }



  //Create Event
  event videoUploaded(
    uint id,
    string hash,
    string title,
    address author
  );


  constructor() public {
  }

  function uploadVideo(string memory _videoHash, string memory _title) public {
    // Make sure the video hash exists
    require(bytes(_videoHash).length>0,'Video Hash connot be empty');

    // Make sure video title exists
    require(bytes(_title).length>0,'Video Title connot be empty');


    // Make sure uploader address exists
    require(msg.sender!=address(0),'Sender address cannot  be empty');

    


    // Increment video id
    videoCount++;

    // Add video to the contract
    videos[videoCount]=Video(videoCount,_videoHash,_title,msg.sender);

    // Trigger an event
    emit videoUploaded(videoCount, _videoHash,_title,msg.sender);

  }
}
