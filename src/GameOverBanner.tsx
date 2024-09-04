import React from "react";

function GameOverBanner() {
  return (
    <pre className="flex items-center gap-8">
      <code className="[font-size:4px] leading-snug block">
        {`              @@@@   @@@@              
          @@@@@@@@   @@@@@@@@          
          @@@@@@@@   @@@@@@@@          
          @@@@@@@@   @@@@@@@@          
          @@@@@@@@   @@@@@@@@          
          @@@@@@@@   @@@@@@@@          
          @@@@@@@@   @@@@@@@@          
          @@@@@@@@   @@@@@@@@          
          @@@@@@@@   @@@@@@@@          
        @@@@@@@@@@   @@@@@@@@@         
    @@@@@@@@@@@@@@   @@@@@@@@@@@@@@    
  @@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@  
  @@@@@@@@@@@@@@@@   @@@@@@@@@@@@@@@@  
  @@@@@@@@@@@@@         @@@@@@@@@@@@@  
  @@@@@@@@       @@@@@      @@@@@@@@@  
  @@@@       @@@@@@@@@@@@@       @@@@  
         @@@@@@@@@@@@@@@@@@@@@         
     @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    
       @@@@@@@@@@@@@@@@@@@@@@@@@       
           @@@@@@@@@@@@@@@@            
                @@@@@@@                `}
      </code>
      <code className="text-xs text-re font-bold leading-3">
        {`
 ██████   █████  ███    ███ ███████      ██████  ██    ██ ███████ ██████  ██ 
██       ██   ██ ████  ████ ██          ██    ██ ██    ██ ██      ██   ██ ██ 
██   ███ ███████ ██ ████ ██ █████       ██    ██ ██    ██ █████   ██████  ██ 
██    ██ ██   ██ ██  ██  ██ ██          ██    ██  ██  ██  ██      ██   ██    
 ██████  ██   ██ ██      ██ ███████      ██████    ████   ███████ ██   ██ ██ 
                                                                             
                                                                             
`}
      </code>
    </pre>
  );
}

export default GameOverBanner;
