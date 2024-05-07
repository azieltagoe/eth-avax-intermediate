// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract errors {

    int public cup;

    int constant public maxLiters = 5;

    function addWater(int liters) public {
       require(cup + liters <= maxLiters, "the cup will overflow if you add too much water");

       cup += liters;
    }

    function pourWater(int liters) public {

        assert(liters <= maxLiters);

        if (cup - liters < 0)  {
            revert("the cup doesn't contain that much water");
        }

        cup -= liters;
    }
}