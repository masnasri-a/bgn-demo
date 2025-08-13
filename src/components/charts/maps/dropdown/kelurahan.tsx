import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinceStore } from './hook';

type Kelurahan = {
	kd_kelurahan: string;
	nm_kelurahan: string;
};

const KelurahanDropdown: React.FC = () => {
	const [kelurahans, setKelurahans] = useState<Kelurahan[]>([]);
	const {selected: selectedProv} = useProvinceStore();
	const { selected: selectedKab } = useKabupatenStore();
	const { selected: selectedKec } = useKecamatanStore();
    const { selected: selectedKel, setSelected: setSelectedKel } = useKelurahanStore();

	useEffect(() => {
		console.log("selectedProv : "+JSON.stringify(selectedProv));
		console.log("selectedKab : "+JSON.stringify(selectedKab));
		console.log("selectedKec : "+JSON.stringify(selectedKec));

		fetch('https://bgn-be.anakanjeng.site/maps/centroid?kd_propinsi=' + selectedProv?.kd_propinsi + '&kd_kabupaten=' + selectedKab?.kd_kabupaten + '&kd_kecamatan=' + selectedKec?.kd_kecamatan)
			.then((res) => res.json())
			.then((data) => {
				if (data && data.features) {
					const kelurs = data.features.map((f: any) => ({
						kd_kelurahan: f.properties.kd_kelurahan,
						nm_kelurahan: f.properties.nm_kelurahan,
					}));
					setKelurahans(kelurs);
				}
			});
	}, [selectedProv, selectedKab, selectedKec]);

	return (
		<Select
			value={selectedKel?.kd_kelurahan || 'all'}
			disabled={!selectedKec}
			onValueChange={(value) => {
				const selected = kelurahans.find(kel => kel.kd_kelurahan === value);
				if (selected) {
					setSelectedKel(selected);
				}
			}}
		>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Pilih Kelurahan" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">Pilih Kelurahan</SelectItem>
				{kelurahans.map((kel) => (
					<SelectItem key={kel.kd_kelurahan} value={kel.kd_kelurahan}>
						{kel.nm_kelurahan}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default KelurahanDropdown;
