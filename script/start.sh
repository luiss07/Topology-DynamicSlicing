#!/usr/bin/env bash

# run ryu controller
cd ~/comnetsemu/Topology-DynamicSlicing/topologyVisualizer
ryu-manager --observe-links gui_start.py simple_switch.py
sleep 1
#run mininet
#sudo python3 ~/comnetsemu/Topology-DynamicSlicing//topology.py
