package com.cryptovaultx.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "watchlists", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "market_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Watchlist extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "market_id", nullable = false)
    private Market market;
}
