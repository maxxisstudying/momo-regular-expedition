package com.example.momo.controller;

import com.example.momo.dto.*;
import com.example.momo.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trade")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TradeController {

    private final TradeService tradeService;

    @PostMapping
    public ResponseEntity<SaveSlotDto> performTrade(@RequestBody TradeDto dto) {
        return ResponseEntity.ok(tradeService.performTrade(dto));
    }
}
