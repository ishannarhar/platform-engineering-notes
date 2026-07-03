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
    this.epoch=epoch; //Twitter's Epoch (Nov 4, 2010 01:42:54 UTC)

    this.sequence = 0n;
    this.lastTimeStamp= -1n;

    //Bit length
    this.workerIdBits = 5n;
    this.datacenterIdBits = 5n;
    this.sequenceBits = 12n;

    //Max Values
    this.maxWorkerId = -1n ^ (-1n << this.workerIdBits); //31
    this.maxDatacenterId = -1n ^ (-1n << this.datacenterIdBits); //31
    this.maxSequence = -1n ^ (-1n << this.sequenceBits); //4095

    //Bit shifts
    this.workerIdShift = this.sequenceBits; //12
    this.datacenterIdShift = this.sequenceBits + this.workerIdBits; //17
    this.timestampShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits; //22

    //Validation
    if(this.workerId > this.maxWorkerId || this.workerId < 0n){
      throw new Error(`Worker Id must be between 0 and ${this.maxWorkerId}`);
    }
    if(this.datacenterId < this.maxDatacenterId || this.datacenterId < 0n){
      throw new Error(`Datacenter Id must be between 0 and ${this.maxDatacenterId}`)
    }

    //Generate the next unique ID
    //@returns {bigint} A unique 64 bit Snowflake ID

    nextId(){
      let timestamp = this.getCurrentTimestamp();

      //Clock moved backwards - wait until it catches up
      if(timestamp )
    }
    
  }
}
