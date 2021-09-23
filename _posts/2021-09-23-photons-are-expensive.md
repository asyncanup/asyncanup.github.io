"Photons are expensive" in Autonomous Driving.
Why?

(Thoughts my own, not employer's)

Throwing the photons out from a LiDAR is easy, but that's only the start of the journey in achieving their long-winded purpose. Here are some costs as they continue on that journey:


- Throwing them onto the road ahead (expensive LiDAR, hardware and electricity costs)
- Catching them back to capture the data they embody (compute costs)
- From this point on, it's not the photons, but the data they brought back from their voyage above the tarmac that holds meaning. The costs henceforth are in capturing the meaning and corresponding action from that sweet sensor data, all of which participates in some form in carrying out the following steps.
- Running an onboard perception stack on the sensor data (special purpose hardware, compute costs)
- Planning the vehicle's motion, immediate actions, based on the perceived reality (onboard compute costs)
- Saving raw sensor data, as well as the perception output, planner output, and end-to-end decision log (storage costs)
- Ingesting the data in offline cloud/on-prem infrastructure to validate onboard decisions and train on them (network/compute/storage costs)
- Running an autonomy stack on the incoming data, slicing and dicing it for all the different needs of all the different teams (compute, compute, compute)
- Visualize gigantic raw sensor data as well as correlated perception/planner output to find outliers, insights, novel scenarios (compute, network, human costs)
- Label the raw data, to train the stack for doing better in the next LiDAR-spinning photon-throwing road-trip adventure (storage, network, human costs)
- Simulate on-road behavior with labeled data, get ahead of failures with training and validation offline instead of in a metal ball moving at 60 mph (compute, network, storage, human)
- Train and train hard (hardware, storage, compute)
- Visualize, debug, assess, analyze that plain ol' photon's journey into oncoming traffic to death (not really, photons live forever in the cloud) with offline tooling (compute, human, whiteboards)
- Share videos and pictures of our dear photons partying around in sweet LiDAR visualizations out to the whole world so they can spend some CPU/GPU cycles on them too!
- Roll the metal-ball-with-a-computer-and-spinning-photon-launchers out again, and on it goes


Photons are expensive. No shit.

But they give us self-driving.

Amen to that.
