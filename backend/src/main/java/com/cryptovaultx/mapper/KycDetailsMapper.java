package com.cryptovaultx.mapper;

import com.cryptovaultx.dto.KycDetailsDto;
import com.cryptovaultx.entity.KycDetails;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface KycDetailsMapper {
    KycDetailsMapper INSTANCE = Mappers.getMapper(KycDetailsMapper.class);

    @Mapping(source = "user.id", target = "userId")
    KycDetailsDto toDto(KycDetails entity);
}
