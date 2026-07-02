-- Set max_allowed_packet to 256MB
-- Run this in MySQL Workbench or via command line

SET GLOBAL max_allowed_packet = 268435456;

-- Verify it was set
SHOW VARIABLES LIKE 'max_allowed_packet';
