#!/usr/bin/env bash

# run ryu controller
cd ~/comnetsemu/Topology-DynamicSlicing/topologyVisualizer
ryu-manager --observe-links gui_start.py controller.py
sleep 1