#!/bin/bash
echo "Running Final Audit..."
npm run lint
npm run build
echo "Audit Complete. Ready for Backend."
