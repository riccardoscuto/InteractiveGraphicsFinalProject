import { Button, Center, Input, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, SimpleGrid } from '@chakra-ui/react';
import React from 'react'

export default function ColorPicker({ color, setColor, colors}) {
    return (
        <Popover variant="picker">
            <PopoverTrigger>
                <Button
                    aria-label={color}
                    background={color}
                    height="22px"
                    width="22px"
                    padding={0}
                    minWidth="unset"
                    borderRadius={3}
                ></Button>
            </PopoverTrigger>
            <PopoverContent width="170px">
                <PopoverArrow bg={color} />
                <PopoverCloseButton color="white" />
                <PopoverHeader
                    height="100px"
                    backgroundColor={color}
                    borderTopLeftRadius={5}
                    borderTopRightRadius={5}
                    color="white"
                >
                    <Center height="100%">{color}</Center>
                </PopoverHeader>
                <PopoverBody height="120px">
                    <SimpleGrid columns={5} spacing={2}>
                        {colors.map((c) => (
                            <Button
                                key={c}
                                aria-label={c}
                                background={c}
                                height="22px"
                                width="22px"
                                padding={0}
                                minWidth="unset"
                                borderRadius={3}
                                _hover={{ background: c }}
                                onClick={() => {
                                    setColor(c);
                                }}
                            ></Button>
                        ))}
                    </SimpleGrid>
                    <Input
                        borderRadius={3}
                        marginTop={3}
                        placeholder="red.100"
                        size="sm"
                        value={color}
                        onChange={(e) => {
                            setColor(e.target.value);
                        }}
                    />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
