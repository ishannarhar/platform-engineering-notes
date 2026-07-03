class SnowflakeGenerator{
  constructor(workerId, datacenterId, epoch=1288834974657n){
    //Bit Allocation (total 64 bits)
    //1 bit: unused (always 0 for positive numbers)
    //41 bits: timestamp in milliseconds
    //5 bits: datacenter id
    //5 bits: worker id
    //12 bits: sequence number
    this.workerId = BigInt(workerId);
    this.datacenterId = BigInt(datacenterId);

    //Twitter's custom epoch (Nov 04, 2010) - Using  a recent epoch gives us more years of overflow
    this.epoch=epoch; //Twitter's Epoch (Nov 4, 2010 01:42:54 UTC)

    //Track the sequence number and last timestamp to handle multiple Ids in same milliseconds
    this.sequence = 0n;
    this.lastTimeStamp= -1n;

    //Validate that the ids are within the acceptable rand
    if(this.workerId > 31n || this.workerId < 0n){
      throw new Error(`Worker Id must be between 0 and 31`);
    }
    if(this.datacenterId >31n || this.datacenterId < 0n){
      throw new Error(`Datacenter Id must be between 0 and 31`)
    }

    //Generate the next unique ID
    //@returns {bigint} A unique 64 bit Snowflake ID

    nextId(){
      let timestamp = BigInt(Date.now())

      //Step 1: Handle clock moving backwards (System time was adjusted)
      //This is critical - we cannot generate ids with timestamps in the past
      if(timestamp < this.lastTimestamp ){
        throw new Error(`Clock moved backwards. Cannot generate ID`)
      }

      //Step 2: Handle multiple ids requested within the same millisecond
      if(timestamp = this.lastTimestamp){
        //Increment sequence and use bitwise AND with 4095 
        //This means we can generate upto 4096 IDs per milliseconds
        this.sequence = (this.sequence + 1n) & 4095n;

        //If sequence wrapped back to 0, we've exhausted this millisecond
        //Wait for the next millisecond before continuing
        if(this.sequence === 0n){
          while(timestamp <= this.lastTimestamp){
            timestamp = BigInt(Date.now())
          }
        }
      }else{
        //Step 3: New Millisecond - reset sequence to 0
        this.sequence = 0n;
      }

      //Update last timestamp for next call
      this.lastTimestamp = timestamp

      //Step 4: Construct the 64 bit ID by combining all the elements
      //Layout: [1 bit unused][41 bits timestamp][5 bits datacenter][5 bits worker][12 bits sequence]
      
    }
    
  }
}
